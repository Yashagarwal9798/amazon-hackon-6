import { createClient } from "https://esm.sh/@supabase/supabase-js@2.108.2";

type ChatRole = "user" | "assistant" | "system";

type ChatMessage = {
  id: string;
  session_id: string;
  role: ChatRole;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

type ChatSession = {
  id: string;
  user_id: string;
  title: string;
  active_mode: string | null;
  latest_cart_draft_id: string | null;
  created_at: string;
  updated_at: string;
};

type RecipeDocument = {
  name: string;
  aliases: string[];
  base_servings: number;
  ingredients: Ingredient[];
};

type OccasionTemplate = {
  name: string;
  aliases: string[];
  required_slots: string[];
  item_requirements: Ingredient[];
};

type HealthcareTemplate = {
  name: string;
  aliases: string[];
  safety_message: string;
  item_requirements: Ingredient[];
};

type EmergencyTemplate = {
  name: string;
  aliases: string[];
  item_requirements: Ingredient[];
};

type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
  category: string;
};

type Product = {
  id: string;
  title: string;
  brand: string;
  category: string;
  aliases: string[];
  pack_size: string;
  unit: string;
  price: number;
  rating: number;
  available: boolean;
  delivery_eta_minutes: number;
  image_url?: string | null;
};

type PreferenceProfile = {
  preferred_brands_by_category: Record<string, string[]>;
};

type PurchaseHistory = {
  product_id?: string | null;
  product_title: string;
  brand: string;
  category: string;
  purchased_at: string;
};

type SidekickIntent = "recipe" | "occasion" | "healthcare" | "emergency" | "upload_list" | "unsupported";

type LlmPlan = {
  intent: SidekickIntent;
  dishName: string | null;
  occasionName: string | null;
  healthcareNeed: string | null;
  emergencyType: string | null;
  listName: string | null;
  servings: number | null;
  guestCount: number | null;
  personCount: number | null;
  durationDays: number | null;
  durationHours: number | null;
  urgency: "low" | "medium" | "high" | null;
  needsClarification: boolean;
  assistantMessage: string;
  ingredients: Ingredient[];
};

type MatchedCartItem = {
  requirement_name: string;
  product_id: string | null;
  product_title: string;
  brand: string;
  quantity: number;
  unit: string;
  pack_size: string;
  price: number;
  rating: number;
  available: boolean;
  delivery_eta_minutes: number;
  reason: string;
  alternatives: Product[];
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const supabaseUrl = requiredEnv("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? requiredEnv("SUPABASE_ANON_KEY");
    const openRouterApiKey = requiredEnv("OPENROUTER_API_KEY");
    const model = Deno.env.get("OPENROUTER_MODEL") ?? "google/gemini-2.5-flash";

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();
    const userId = String(body.userId ?? "demo-user");
    const imageDataUrl = normalizeImageDataUrl(body.imageDataUrl);
    const imageName = body.imageName ? String(body.imageName) : null;
    const rawMessage = String(body.message ?? "").trim();
    const message = rawMessage || (imageDataUrl ? `Uploaded grocery list image${imageName ? `: ${imageName}` : ""}` : "");
    const selectedMode = body.selectedMode ? String(body.selectedMode) : null;

    if (!message) {
      return jsonResponse({ error: "Message is required" }, 400);
    }

    const session = await getOrCreateSession(supabase, body.sessionId, userId, selectedMode);

    await insertMessage(supabase, session.id, "user", message);

    const messages = await getSessionMessages(supabase, session.id);
    const recipeContext = await findRecipeContext(supabase, message);
    const occasionContext = await findOccasionContext(supabase, message);
    const healthcareContext = await findHealthcareContext(supabase, message);
    const emergencyContext = await findEmergencyContext(supabase, message);
    const plan = await callOpenRouter({
      apiKey: openRouterApiKey,
      model,
      messages,
      currentRequest: message,
      selectedMode,
      recipeContext,
      occasionContext,
      healthcareContext,
      emergencyContext,
      imageDataUrl,
      imageName,
    });

    const assistantMessage = normalizeAssistantMessage(plan);

    await insertMessage(supabase, session.id, "assistant", assistantMessage, {
      llmPlan: plan,
      recipeContextUsed: recipeContext.map((recipe) => recipe.name),
      occasionContextUsed: occasionContext.map((occasion) => occasion.name),
      healthcareContextUsed: healthcareContext.map((template) => template.name),
      emergencyContextUsed: emergencyContext.map((template) => template.name),
      imageUploadUsed: Boolean(imageDataUrl),
      imageName,
    });

    const title = createSessionTitle(plan, message);
    await supabase
      .from("sidekick_chat_sessions")
      .update({
        title,
        active_mode: getActiveMode(plan, selectedMode),
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.id);

    if (plan.intent === "unsupported" || plan.needsClarification || !hasRequiredQuantity(plan) || plan.ingredients.length === 0) {
      const refreshedMessages = await getSessionMessages(supabase, session.id);
      const refreshedSession = await getSession(supabase, session.id);

      return jsonResponse({
        session: refreshedSession,
        messages: refreshedMessages,
        cartDraft: null,
        missingSlots: getMissingSlots(plan),
      });
    }

    const cartDraft = await createCartDraft({
      supabase,
      sessionId: session.id,
      userId,
      plan,
    });
    const refreshedMessages = await getSessionMessages(supabase, session.id);
    const refreshedSession = await getSession(supabase, session.id);

    return jsonResponse({
      session: refreshedSession,
      messages: refreshedMessages,
      cartDraft,
      missingSlots: [],
    });
  } catch (error) {
    console.error(error);
    return jsonResponse(
      {
        error: error instanceof Error ? error.message : "Unknown Sidekick error",
      },
      500,
    );
  }
});

function requiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function normalizeImageDataUrl(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed.startsWith("data:image/")) {
    return null;
  }

  return trimmed;
}

async function getOrCreateSession(
  supabase: ReturnType<typeof createClient>,
  sessionId: string | undefined,
  userId: string,
  selectedMode: string | null,
) {
  if (sessionId) {
    const session = await getSession(supabase, sessionId);
    if (session) {
      return session;
    }
  }

  const { data, error } = await supabase
    .from("sidekick_chat_sessions")
    .insert({
      user_id: userId,
      title: "New Sidekick chat",
      active_mode: selectedMode,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as ChatSession;
}

async function getSession(supabase: ReturnType<typeof createClient>, sessionId: string) {
  const { data, error } = await supabase
    .from("sidekick_chat_sessions")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as ChatSession | null;
}

async function insertMessage(
  supabase: ReturnType<typeof createClient>,
  sessionId: string,
  role: ChatRole,
  content: string,
  metadata: Record<string, unknown> = {},
) {
  const { error } = await supabase.from("sidekick_chat_messages").insert({
    session_id: sessionId,
    role,
    content,
    metadata,
  });

  if (error) {
    throw error;
  }
}

async function getSessionMessages(supabase: ReturnType<typeof createClient>, sessionId: string) {
  const { data, error } = await supabase
    .from("sidekick_chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as ChatMessage[];
}

async function findRecipeContext(supabase: ReturnType<typeof createClient>, currentRequest: string) {
  const requestText = currentRequest.toLowerCase();
  const { data, error } = await supabase
    .from("recipe_documents")
    .select("name, aliases, base_servings, ingredients")
    .limit(20);

  if (error) {
    throw error;
  }

  const recipes = (data ?? []) as RecipeDocument[];

  const exactMatches = recipes.filter((recipe) => {
    const candidates = [recipe.name, ...(recipe.aliases ?? [])].map((value) => value.toLowerCase());
    return candidates.some((candidate) => requestText.includes(candidate));
  });

  return exactMatches.length > 0 ? exactMatches : recipes;
}

async function findOccasionContext(supabase: ReturnType<typeof createClient>, currentRequest: string) {
  const requestText = currentRequest.toLowerCase();
  const { data, error } = await supabase
    .from("occasion_templates")
    .select("name, aliases, required_slots, item_requirements")
    .limit(20);

  if (error) {
    throw error;
  }

  const templates = (data ?? []) as OccasionTemplate[];

  const exactMatches = templates.filter((template) => {
    const candidates = [template.name, ...(template.aliases ?? [])].map((value) => value.toLowerCase());
    return candidates.some((candidate) => requestText.includes(candidate));
  });

  return exactMatches.length > 0 ? exactMatches : templates;
}

async function findHealthcareContext(supabase: ReturnType<typeof createClient>, currentRequest: string) {
  const requestText = currentRequest.toLowerCase();
  const { data, error } = await supabase
    .from("healthcare_templates")
    .select("name, aliases, safety_message, item_requirements")
    .limit(20);

  if (error) {
    throw error;
  }

  const templates = (data ?? []) as HealthcareTemplate[];

  const exactMatches = templates.filter((template) => {
    const candidates = [template.name, ...(template.aliases ?? [])].map((value) => value.toLowerCase());
    return candidates.some((candidate) => requestText.includes(candidate));
  });

  return exactMatches.length > 0 ? exactMatches : templates;
}

async function findEmergencyContext(supabase: ReturnType<typeof createClient>, currentRequest: string) {
  const requestText = currentRequest.toLowerCase();
  const { data, error } = await supabase
    .from("emergency_templates")
    .select("name, aliases, item_requirements")
    .limit(20);

  if (error) {
    throw error;
  }

  const templates = (data ?? []) as EmergencyTemplate[];

  const exactMatches = templates.filter((template) => {
    const candidates = [template.name, ...(template.aliases ?? [])].map((value) => value.toLowerCase());
    return candidates.some((candidate) => requestText.includes(candidate));
  });

  return exactMatches.length > 0 ? exactMatches : templates;
}

async function callOpenRouter({
  apiKey,
  model,
  messages,
  currentRequest,
  selectedMode,
  recipeContext,
  occasionContext,
  healthcareContext,
  emergencyContext,
  imageDataUrl,
  imageName,
}: {
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  currentRequest: string;
  selectedMode: string | null;
  recipeContext: RecipeDocument[];
  occasionContext: OccasionTemplate[];
  healthcareContext: HealthcareTemplate[];
  emergencyContext: EmergencyTemplate[];
  imageDataUrl: string | null;
  imageName: string | null;
}) {
  const conversation: Array<{
    role: "user" | "assistant";
    content:
      | string
      | Array<
          | { type: "text"; text: string }
          | { type: "image_url"; image_url: { url: string } }
        >;
  }> = messages.slice(-8).map((message) => ({
    role: message.role === "assistant" ? "assistant" : "user",
    content: message.content,
  }));

  if (imageDataUrl) {
    const imagePrompt = `${currentRequest}

Read the attached grocery list image${imageName ? ` named ${imageName}` : ""}. Extract each visible shopping item and any visible quantity, then return the JSON plan using intent "upload_list".`;
    const latestMessage = conversation[conversation.length - 1];

    if (latestMessage?.role === "user") {
      latestMessage.content = [
        { type: "text", text: imagePrompt },
        { type: "image_url", image_url: { url: imageDataUrl } },
      ];
    } else {
      conversation.push({
        role: "user",
        content: [
          { type: "text", text: imagePrompt },
          { type: "image_url", image_url: { url: imageDataUrl } },
        ],
      });
    }
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": Deno.env.get("SITE_URL") ?? "http://localhost:5173",
      "X-Title": "Amazon Sidekick",
      "X-OpenRouter-Title": "Amazon Sidekick",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 1100,
      messages: [
        {
          role: "system",
          content: createSystemPrompt(
            recipeContext,
            occasionContext,
            healthcareContext,
            emergencyContext,
            currentRequest,
            selectedMode,
            Boolean(imageDataUrl),
            imageName,
          ),
        },
        ...conversation,
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter request failed: ${response.status} ${errorText}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    throw new Error("OpenRouter response did not include message content.");
  }

  return normalizePlan(parseModelJson(content));
}

function createSystemPrompt(
  recipeContext: RecipeDocument[],
  occasionContext: OccasionTemplate[],
  healthcareContext: HealthcareTemplate[],
  emergencyContext: EmergencyTemplate[],
  currentRequest: string,
  selectedMode: string | null,
  hasImageUpload: boolean,
  imageName: string | null,
) {
  return `
You are Amazon Sidekick, a shopping assistant for Amazon Now.
Your current feature scope is Recipe Mode, Occasion Mode, Healthcare Essentials Mode, Emergency Mode, and Upload List image reading.

Latest user request:
${currentRequest}

Selected UI mode:
${selectedMode ?? "none"}

Uploaded image:
${hasImageUpload ? imageName ?? "attached grocery list image" : "none"}

Return ONLY valid JSON with this shape:
{
  "intent": "recipe" | "occasion" | "healthcare" | "emergency" | "upload_list" | "unsupported",
  "dishName": string | null,
  "occasionName": string | null,
  "healthcareNeed": string | null,
  "emergencyType": string | null,
  "listName": string | null,
  "servings": number | null,
  "guestCount": number | null,
  "personCount": number | null,
  "durationDays": number | null,
  "durationHours": number | null,
  "urgency": "low" | "medium" | "high" | null,
  "needsClarification": boolean,
  "assistantMessage": string,
  "ingredients": [
    { "name": string, "quantity": number, "unit": "g" | "kg" | "ml" | "l" | "piece" | "pack", "category": string }
  ]
}

Rules:
- Treat the latest user request as the current task.
- Previous chat messages are context only for short follow-ups like "4 people", "make it for 6", "12 guests", or "add drinks".
- If the selected UI mode contains "Recipe", prefer intent "recipe" unless the latest request clearly contradicts it.
- If the selected UI mode contains "Occasion", prefer intent "occasion" unless the latest request clearly contradicts it.
- If the selected UI mode contains "Healthcare", prefer intent "healthcare" unless the latest request clearly contradicts it.
- If the selected UI mode contains "Emergency", prefer intent "emergency" unless the latest request clearly contradicts it.
- If the selected UI mode contains "Upload" or an image is attached, set intent "upload_list".
- If no mode is selected, classify the latest request. Cooking a dish is "recipe"; planning an event, gathering, party, meeting, picnic, festival, movie night, or birthday is "occasion"; basic care, cold care, fever support, wound care, hygiene, or wellness essentials are "healthcare"; household emergency, power cut, outage, water shortage, heavy rain, flood prep, travel disruption, or urgent home supplies are "emergency".
- If the latest user request names a dish, plan for that latest dish and ignore older dish names.
- If the user wants to cook or make food, set intent to "recipe".
- If the user wants to host, celebrate, meet, gather, or arrange snacks/supplies for people, set intent to "occasion".
- If the user wants basic care supplies, fever/cold support essentials, wound care, hygiene supplies, or a first-aid kit, set intent to "healthcare".
- If the user wants supplies for a household, utility, weather, or travel emergency, set intent to "emergency".
- Understand messy user text. Correct obvious spelling mistakes, Hinglish, abbreviations, and short forms.
- Examples: "paner buter masla" means "paneer butter masala"; "bday party" means "birthday party"; "cold care for 2 ppl" means healthcare essentials for 2 people; "power cut for 4 ppl" means emergency essentials for 4 people; "4 ppl" means 4 people; "serves 4" means servings 4.
- Use the full conversation context. If Sidekick previously asked for servings and the latest user message is only a number, treat that number as servings for the previous dish.
- If Sidekick previously asked for guest count and the latest user message is only a number, treat that number as guestCount for the previous occasion.
- If Sidekick previously asked for person count and the latest user message is only a number, treat that number as personCount for the previous healthcare need.
- If Sidekick previously asked for emergency person count and the latest user message is only a number, treat that number as personCount for the previous emergency.
- If the dish is known but serving count is missing, set needsClarification true, servings null, ingredients [], and ask "For how many people?"
- If the occasion is known but guest count is missing, set needsClarification true, guestCount null, ingredients [], and ask "How many people should I plan for?"
- If the healthcare need is known but person count is missing, set needsClarification true, personCount null, ingredients [], and ask "How many people should I prepare these care essentials for?"
- If the emergency type is known but person count is missing, set needsClarification true, personCount null, ingredients [], and ask "How many people should I prepare emergency essentials for?"
- If serving count is present or provided in a follow-up, return scaled ingredients for that serving count.
- If guest count is present or provided in a follow-up, return scaled occasion requirements for that guest count.
- If person count is present or provided in a follow-up, return scaled healthcare essentials for that person count.
- If emergency person count is present or provided in a follow-up, return scaled emergency essentials for that person count.
- For upload_list, read the attached image as a grocery/shopping list. Extract one ingredient item per visible line or bullet.
- For upload_list, preserve visible quantities and units. If no quantity is visible, use quantity 1 and unit "pack" unless the item is naturally counted as "piece".
- For upload_list, do not ask a quantity follow-up. Build a reviewable Mini Cart from extracted items.
- For upload_list, set listName to a short name like "Uploaded grocery list" or a visible heading from the image.
- For upload_list, use categories likely to match the catalog: dairy, bakery, eggs, staples, beverages, fruits, vegetables, snacks, personal_care, household, hygiene, healthcare.
- For upload_list, if the image is unreadable, set needsClarification true, ingredients [], and ask the user to upload a clearer list photo.
- Use the recipe context below if it matches the latest dish. If no recipe context matches, use common cooking knowledge and still return a practical ingredient list.
- Use the occasion context below if it matches the latest occasion. If no occasion context matches, use common Indian shopping knowledge and still return a practical item list.
- Use the healthcare context below if it matches the latest care need. If no healthcare context matches, use common basic-care shopping knowledge and still return a practical item list.
- Use the emergency context below if it matches the latest emergency type. If no emergency context matches, use common household emergency shopping knowledge and still return a practical item list.
- Healthcare context quantities are a practical starter template for 1 person. Scale gently by personCount. If durationDays is missing, assume 3 days for cold/fever care and 1 kit for wound care or hygiene requests.
- Healthcare mode must include a safety disclaimer in assistantMessage. Do not diagnose, prescribe, provide dosage instructions, or claim a product treats a condition. Recommend only basic care essentials and non-prescription support items.
- If the user describes severe symptoms, breathing trouble, chest pain, serious injury, allergic reaction, very high fever, pregnancy, infants, elderly risk, or urgent medical danger, ask them to contact a qualified clinician or emergency services and only build a basic support cart if the request still asks for supplies.
- For healthcare carts, use item names likely to exist in grocery/quick-commerce catalogs, such as digital thermometer, ORS, hand sanitizer, face masks, tissues, antiseptic liquid, bandages, cotton, vapor rub, cough drops, sanitary pads.
- For healthcare carts, use these categories when possible: healthcare, personal_care, hygiene, baby_care.
- Emergency context quantities are a practical starter template for 4 people. Scale gently by personCount. If durationHours is missing, assume 6 hours for power cuts and 12 hours for water/rain/travel emergencies.
- Emergency mode is for household supply planning only. If the prompt describes immediate danger, injury, fire, gas leak, flood evacuation, or life safety risk, assistantMessage must tell the user to contact local emergency services first.
- For emergency carts, use item names likely to exist in grocery/quick-commerce catalogs, such as torch, batteries, power bank, candles, matches, bottled water, ready to eat snacks, wet wipes, mosquito repellent, garbage bags.
- For emergency carts, use these categories when possible: emergency, electronics, household, beverages, ready_to_eat, hygiene.
- Occasion context quantities are a practical starter template for around 10 guests. Scale gently from that baseline.
- Do not overbuy for occasions: one 500g cake serves about 8-10 people, drinks should be around 250-300ml per person, snacks should be 1-2 small packs per 4 people, and disposables should be guest count plus a small buffer.
- For occasion carts, use item names likely to exist in grocery/quick-commerce catalogs, such as chips, namkeen, cold drink, juice, cake, cookies, chocolates, paper plates, paper cups, tissue napkins, candles, balloons.
- For occasion carts, use these categories when possible: snacks, beverages, bakery, sweets, disposables, party_supplies.
- Do not choose Amazon products or brands. Only return item requirements.
- Do not return markdown.

Recipe context:
${JSON.stringify(recipeContext)}

Occasion context:
${JSON.stringify(occasionContext)}

Healthcare context:
${JSON.stringify(healthcareContext)}

Emergency context:
${JSON.stringify(emergencyContext)}
`.trim();
}

function parseModelJson(content: string) {
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("LLM response was not valid JSON.");
    }
    return JSON.parse(match[0]);
  }
}

function normalizePlan(raw: Partial<LlmPlan> & { items?: Ingredient[] }): LlmPlan {
  const rawIngredients = Array.isArray(raw.ingredients) ? raw.ingredients : raw.items;
  const ingredients = Array.isArray(rawIngredients)
    ? rawIngredients
        .map((ingredient) => ({
          name: String(ingredient.name ?? "").trim().toLowerCase(),
          quantity: Number(ingredient.quantity ?? 0),
          unit: String(ingredient.unit ?? "pack").toLowerCase(),
          category: String(ingredient.category ?? "grocery").trim().toLowerCase(),
        }))
        .filter((ingredient) => ingredient.name && ingredient.quantity > 0)
    : [];

  const servings = raw.servings === null || raw.servings === undefined ? null : Number(raw.servings);
  const guestCount = raw.guestCount === null || raw.guestCount === undefined ? null : Number(raw.guestCount);
  const personCount = raw.personCount === null || raw.personCount === undefined ? null : Number(raw.personCount);
  const durationDays = raw.durationDays === null || raw.durationDays === undefined ? null : Number(raw.durationDays);
  const durationHours = raw.durationHours === null || raw.durationHours === undefined ? null : Number(raw.durationHours);
  const intent =
    raw.intent === "recipe" ||
    raw.intent === "occasion" ||
    raw.intent === "healthcare" ||
    raw.intent === "emergency" ||
    raw.intent === "upload_list"
      ? raw.intent
      : "unsupported";
  const normalizedServings = servings && Number.isFinite(servings) ? servings : null;
  const normalizedGuestCount = guestCount && Number.isFinite(guestCount) ? guestCount : null;
  const normalizedPersonCount = personCount && Number.isFinite(personCount) ? personCount : null;
  const normalizedDurationDays = durationDays && Number.isFinite(durationDays) ? durationDays : null;
  const normalizedDurationHours = durationHours && Number.isFinite(durationHours) ? durationHours : null;
  const needsClarification = Boolean(
    raw.needsClarification ||
      (intent === "recipe" && !normalizedServings) ||
      (intent === "occasion" && !normalizedGuestCount) ||
      ((intent === "healthcare" || intent === "emergency") && !normalizedPersonCount),
  );

  return {
    intent,
    dishName: raw.dishName ? String(raw.dishName).trim().toLowerCase() : null,
    occasionName: raw.occasionName ? String(raw.occasionName).trim().toLowerCase() : null,
    healthcareNeed: raw.healthcareNeed ? String(raw.healthcareNeed).trim().toLowerCase() : null,
    emergencyType: raw.emergencyType ? String(raw.emergencyType).trim().toLowerCase() : null,
    listName: raw.listName ? String(raw.listName).trim().toLowerCase() : null,
    servings: normalizedServings,
    guestCount: normalizedGuestCount,
    personCount: normalizedPersonCount,
    durationDays: normalizedDurationDays,
    durationHours: normalizedDurationHours,
    urgency: raw.urgency === "low" || raw.urgency === "medium" || raw.urgency === "high" ? raw.urgency : null,
    needsClarification,
    assistantMessage: raw.assistantMessage
      ? String(raw.assistantMessage)
      : needsClarification
        ? intent === "emergency"
          ? "How many people should I prepare emergency essentials for?"
          : intent === "healthcare"
          ? "How many people should I prepare these care essentials for?"
          : intent === "occasion"
          ? "How many people should I plan for?"
          : intent === "upload_list"
          ? "I could not read the uploaded list clearly. Please upload a clearer grocery list photo."
          : "For how many people?"
        : "I can help with recipe, occasion, healthcare, and emergency carts. Tell me what you need.",
    ingredients,
  };
}

const HEALTHCARE_SAFETY_MESSAGE =
  "Basic care items only. This is not medical advice. For severe symptoms, urgent concerns, pregnancy, infants, or allergies, consult a qualified clinician or emergency services.";

function withHealthcareSafetyMessage(message: string) {
  if (message.toLowerCase().includes("not medical advice")) {
    return message;
  }

  return `${message} ${HEALTHCARE_SAFETY_MESSAGE}`;
}

function normalizeAssistantMessage(plan: LlmPlan) {
  if (plan.intent === "unsupported") {
    return "I can help with Recipe, Occasion, Healthcare Essentials, Emergency Mode, and uploaded grocery lists first. Tell me what you want to cook, what event you are planning, what basic care essentials you need, what household emergency you are preparing for, or upload a list photo.";
  }

  if (plan.intent === "recipe" && (plan.needsClarification || !plan.servings)) {
    return plan.assistantMessage || "For how many people?";
  }

  if (plan.intent === "occasion" && (plan.needsClarification || !plan.guestCount)) {
    return plan.assistantMessage || "How many people should I plan for?";
  }

  if (plan.intent === "healthcare" && (plan.needsClarification || !plan.personCount)) {
    return withHealthcareSafetyMessage(
      plan.assistantMessage || "How many people should I prepare these care essentials for?",
    );
  }

  if (plan.intent === "emergency" && (plan.needsClarification || !plan.personCount)) {
    return plan.assistantMessage || "How many people should I prepare emergency essentials for?";
  }

  if (plan.intent === "upload_list" && plan.needsClarification) {
    return plan.assistantMessage || "I could not read the uploaded list clearly. Please upload a clearer grocery list photo.";
  }

  if (plan.intent === "upload_list") {
    return (
      plan.assistantMessage ||
      `I read ${plan.ingredients.length} items from your uploaded grocery list and built a Mini Cart for review.`
    );
  }

  if (plan.intent === "healthcare") {
    return withHealthcareSafetyMessage(
      plan.assistantMessage ||
        `I prepared basic ${plan.healthcareNeed ?? "healthcare"} essentials for ${plan.personCount} people and built a cart for review.`,
    );
  }

  if (plan.intent === "emergency") {
    return (
      plan.assistantMessage ||
      `I prepared ${plan.emergencyType ?? "emergency"} essentials for ${plan.personCount} people and built a cart for review.`
    );
  }

  if (plan.intent === "occasion") {
    return (
      plan.assistantMessage ||
      `I planned ${plan.occasionName ?? "your occasion"} for ${plan.guestCount} guests and built a cart for review.`
    );
  }

  return (
    plan.assistantMessage ||
    `I found the ingredients for ${plan.dishName ?? "your recipe"} for ${plan.servings} people and built a cart for review.`
  );
}

function createSessionTitle(plan: LlmPlan, fallbackMessage: string) {
  if (plan.listName) {
    return `${toTitleCase(plan.listName)} cart`;
  }

  if (plan.emergencyType) {
    return `${toTitleCase(plan.emergencyType)} cart`;
  }

  if (plan.healthcareNeed) {
    return `${toTitleCase(plan.healthcareNeed)} cart`;
  }

  if (plan.occasionName) {
    return `${toTitleCase(plan.occasionName)} cart`;
  }

  if (plan.dishName) {
    return `${toTitleCase(plan.dishName)} cart`;
  }

  return fallbackMessage.length > 42 ? `${fallbackMessage.slice(0, 39)}...` : fallbackMessage;
}

function getActiveMode(plan: LlmPlan, selectedMode: string | null) {
  if (
    plan.intent === "recipe" ||
    plan.intent === "occasion" ||
    plan.intent === "healthcare" ||
    plan.intent === "emergency" ||
    plan.intent === "upload_list"
  ) {
    return plan.intent;
  }

  return selectedMode;
}

function hasRequiredQuantity(plan: LlmPlan) {
  if (plan.intent === "recipe") {
    return Boolean(plan.servings);
  }

  if (plan.intent === "occasion") {
    return Boolean(plan.guestCount);
  }

  if (plan.intent === "healthcare") {
    return Boolean(plan.personCount);
  }

  if (plan.intent === "emergency") {
    return Boolean(plan.personCount);
  }

  if (plan.intent === "upload_list") {
    return true;
  }

  return false;
}

function getMissingSlots(plan: LlmPlan) {
  if (!plan.needsClarification) {
    return [];
  }

  if (plan.intent === "occasion") {
    return ["guestCount"];
  }

  if (plan.intent === "recipe") {
    return ["servings"];
  }

  if (plan.intent === "healthcare") {
    return ["personCount"];
  }

  if (plan.intent === "emergency") {
    return ["personCount"];
  }

  return [];
}

function toTitleCase(value: string) {
  return value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

async function createCartDraft({
  supabase,
  sessionId,
  userId,
  plan,
}: {
  supabase: ReturnType<typeof createClient>;
  sessionId: string;
  userId: string;
  plan: LlmPlan;
}) {
  const { data: catalogData, error: catalogError } = await supabase
    .from("product_catalog")
    .select("*")
    .eq("available", true);

  if (catalogError) {
    throw catalogError;
  }

  const { data: preferenceData, error: preferenceError } = await supabase
    .from("user_preference_profiles")
    .select("preferred_brands_by_category")
    .eq("user_id", userId)
    .maybeSingle();

  if (preferenceError) {
    throw preferenceError;
  }

  const { data: purchaseData, error: purchaseError } = await supabase
    .from("user_purchase_history")
    .select("product_id, product_title, brand, category, purchased_at")
    .eq("user_id", userId)
    .order("purchased_at", { ascending: false })
    .limit(100);

  if (purchaseError) {
    throw purchaseError;
  }

  const catalog = (catalogData ?? []) as Product[];
  const preferences = (preferenceData ?? {
    preferred_brands_by_category: {},
  }) as PreferenceProfile;
  const purchaseHistory = (purchaseData ?? []) as PurchaseHistory[];
  const items = plan.ingredients.map((ingredient) =>
    matchIngredientToProduct(ingredient, catalog, preferences, purchaseHistory),
  );
  const subtotal = items.reduce((total, item) => total + item.price, 0);
  const mode =
    plan.intent === "occasion"
      ? "occasion"
      : plan.intent === "healthcare"
        ? "healthcare"
        : plan.intent === "emergency"
          ? "emergency"
          : plan.intent === "upload_list"
          ? "upload_list"
        : "recipe";
  const planName =
    plan.intent === "occasion"
      ? (plan.occasionName ?? "Occasion")
      : plan.intent === "healthcare"
        ? (plan.healthcareNeed ?? "Healthcare Essentials")
        : plan.intent === "emergency"
          ? (plan.emergencyType ?? "Emergency")
          : plan.intent === "upload_list"
          ? (plan.listName ?? "Uploaded Grocery List")
        : (plan.dishName ?? "Recipe");
  const quantityNote =
    plan.intent === "occasion"
      ? `Generated item requirements for ${plan.guestCount} guests.`
      : plan.intent === "healthcare"
        ? `Generated basic care essentials for ${plan.personCount} people${plan.durationDays ? ` over ${plan.durationDays} days` : ""}.`
        : plan.intent === "emergency"
          ? `Generated emergency essentials for ${plan.personCount} people${plan.durationHours ? ` over ${plan.durationHours} hours` : ""}.`
          : plan.intent === "upload_list"
          ? `Extracted ${plan.ingredients.length} grocery list items from the uploaded image.`
        : `Generated ingredient requirements for ${plan.servings} servings.`;
  const evidenceTitle =
    mode === "occasion"
      ? "OpenRouter occasion planner"
      : mode === "healthcare"
        ? "OpenRouter healthcare essentials planner"
        : mode === "emergency"
          ? "OpenRouter emergency planner"
          : mode === "upload_list"
          ? "OpenRouter image list reader"
        : "OpenRouter recipe planner";

  const { data: draft, error: draftError } = await supabase
    .from("sidekick_cart_drafts")
    .insert({
      session_id: sessionId,
      user_id: userId,
      title: `${toTitleCase(planName)} Cart`,
      mode,
      status: "ready_for_review",
      review_needed: false,
      subtotal,
      evidence: [
        {
          source: "llm",
          title: evidenceTitle,
          confidence: 0.8,
          notes: quantityNote,
        },
      ],
    })
    .select("*")
    .single();

  if (draftError) {
    throw draftError;
  }

  const cartItems = items.map((item) => ({
    cart_draft_id: draft.id,
    ...item,
  }));

  const { data: insertedItems, error: itemsError } = await supabase
    .from("sidekick_cart_items")
    .insert(cartItems)
    .select("*");

  if (itemsError) {
    throw itemsError;
  }

  await supabase
    .from("sidekick_chat_sessions")
    .update({
      latest_cart_draft_id: draft.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  return {
    ...draft,
    items: insertedItems ?? [],
  };
}

function matchIngredientToProduct(
  ingredient: Ingredient,
  catalog: Product[],
  preferences: PreferenceProfile,
  purchaseHistory: PurchaseHistory[],
): MatchedCartItem {
  const scored = catalog
    .map((product) => ({
      product,
      score: scoreProduct(ingredient, product, preferences, purchaseHistory),
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score);

  const best = scored[0]?.product;
  const alternatives = getSameIngredientAlternatives(ingredient, scored, best);

  if (!best) {
    return {
      requirement_name: ingredient.name,
      product_id: null,
      product_title: ingredient.name,
      brand: "TBD",
      quantity: 1,
      unit: ingredient.unit,
      pack_size: `${ingredient.quantity}${ingredient.unit}`,
      price: 0,
      rating: 0,
      available: false,
      delivery_eta_minutes: 0,
      reason: `No catalog product matched ${ingredient.name}.`,
      alternatives: [],
    };
  }

  const packCount = estimatePackCount(ingredient, best.pack_size);

  return {
    requirement_name: ingredient.name,
    product_id: best.id,
    product_title: best.title,
    brand: best.brand,
    quantity: packCount,
    unit: "pack",
    pack_size: best.pack_size,
    price: Number((Number(best.price) * packCount).toFixed(2)),
    rating: Number(best.rating),
    available: best.available,
    delivery_eta_minutes: best.delivery_eta_minutes,
    reason: createProductReason(ingredient, best, preferences, purchaseHistory),
    alternatives,
  };
}

function scoreProduct(
  ingredient: Ingredient,
  product: Product,
  preferences: PreferenceProfile,
  purchaseHistory: PurchaseHistory[],
) {
  const ingredientName = ingredient.name.toLowerCase();
  const productTitle = product.title.toLowerCase();
  const productCategory = product.category.toLowerCase();
  const preferredBrands = preferences.preferred_brands_by_category?.[ingredient.category] ?? [];
  const brandPreferred = preferredBrands.some((brand) => brand.toLowerCase() === product.brand.toLowerCase());
  const directIngredientMatch = productMatchesIngredient(ingredient, product);
  const textIngredientMatch = hasIngredientNameMatch(ingredient, product);
  const previousExactPurchase = purchaseHistory.find((purchase) =>
    isSamePurchasedProductForIngredient(ingredient, product, purchase),
  );
  const previousBrandPurchase = purchaseHistory.find(
    (purchase) =>
      productMatchesPurchaseIngredient(ingredient, purchase) &&
      purchase.brand.toLowerCase() === product.brand.toLowerCase(),
  );

  let score = 0;

  if (!textIngredientMatch && !previousExactPurchase && !previousBrandPurchase) {
    return 0;
  }

  if (productCategory === ingredient.category.toLowerCase()) {
    score += 24;
  }

  if (directIngredientMatch) {
    score += 62;
  }

  if (productTitle.includes(ingredientName)) {
    score += 16;
  }

  if (textIngredientMatch) {
    score += 12;
  }

  if (previousExactPurchase) {
    score += 120;
  } else if (previousBrandPurchase) {
    score += 78;
  }

  if (brandPreferred) {
    score += 42;
  }

  if (product.available) {
    score += 20;
  }

  score += Number(product.rating ?? 0) * 4;
  score += Math.max(0, 10 - Number(product.delivery_eta_minutes ?? 7));

  return score;
}

function getSameIngredientAlternatives(
  ingredient: Ingredient,
  scored: Array<{ product: Product; score: number }>,
  best: Product | undefined,
) {
  if (!best) {
    return [];
  }

  return scored
    .map((candidate) => candidate.product)
    .filter((product) => product.id !== best.id)
    .filter((product) => product.brand.toLowerCase() !== best.brand.toLowerCase())
    .filter((product) => productMatchesIngredient(ingredient, product))
    .slice(0, 4);
}

function productMatchesIngredient(ingredient: Ingredient, product: Pick<Product, "title" | "aliases" | "category">) {
  if (product.category.toLowerCase() !== ingredient.category.toLowerCase()) {
    return false;
  }

  return hasIngredientNameMatch(ingredient, product);
}

function hasIngredientNameMatch(ingredient: Ingredient, product: Pick<Product, "title" | "aliases">) {
  const ingredientName = normalizeText(ingredient.name);
  const ingredientTokens = ingredientName.split(" ").filter(Boolean);
  const title = normalizeText(product.title);
  const aliases = (product.aliases ?? []).map(normalizeText);

  if (!ingredientName) {
    return false;
  }

  if (title === ingredientName || aliases.includes(ingredientName)) {
    return true;
  }

  if (hasWholePhrase(title, ingredientName)) {
    return true;
  }

  if (ingredientTokens.length === 1) {
    return title.split(" ").includes(ingredientName);
  }

  return aliases.some((alias) => hasWholePhrase(alias, ingredientName) || ingredientTokens.every((token) => alias.split(" ").includes(token)));
}

function hasWholePhrase(value: string, phrase: string) {
  return ` ${value} `.includes(` ${phrase} `);
}

function productMatchesPurchaseIngredient(ingredient: Ingredient, purchase: PurchaseHistory) {
  return productMatchesIngredient(ingredient, {
    title: purchase.product_title,
    aliases: [],
    category: purchase.category,
  });
}

function isSamePurchasedProductForIngredient(
  ingredient: Ingredient,
  product: Product,
  purchase: PurchaseHistory,
) {
  if (!productMatchesPurchaseIngredient(ingredient, purchase)) {
    return false;
  }

  if (purchase.product_id && purchase.product_id === product.id) {
    return true;
  }

  return normalizeText(purchase.product_title) === normalizeText(product.title);
}

function estimatePackCount(ingredient: Ingredient, packSize: string) {
  if (ingredient.unit.toLowerCase() === "pack") {
    return Math.max(1, Math.ceil(ingredient.quantity));
  }

  const pack = parsePackSize(packSize);
  if (!pack) {
    return 1;
  }

  const required = normalizeAmount(ingredient.quantity, ingredient.unit);
  const available = normalizeAmount(pack.amount, pack.unit);

  if (!required || !available || required.unit !== available.unit) {
    return 1;
  }

  return Math.max(1, Math.ceil(required.amount / available.amount));
}

function parsePackSize(packSize: string) {
  const match = packSize.toLowerCase().match(/(\d+(?:\.\d+)?)\s*(kg|g|l|ml|piece|pieces|pack)/);
  if (!match) {
    return null;
  }

  return {
    amount: Number(match[1]),
    unit: match[2],
  };
}

function normalizeAmount(amount: number, unit: string) {
  const normalizedUnit = unit.toLowerCase();

  if (normalizedUnit === "kg") {
    return { amount: amount * 1000, unit: "g" };
  }

  if (normalizedUnit === "g") {
    return { amount, unit: "g" };
  }

  if (normalizedUnit === "l") {
    return { amount: amount * 1000, unit: "ml" };
  }

  if (normalizedUnit === "ml") {
    return { amount, unit: "ml" };
  }

  if (normalizedUnit === "piece" || normalizedUnit === "pieces") {
    return { amount, unit: "piece" };
  }

  return null;
}

function createProductReason(
  ingredient: Ingredient,
  product: Product,
  preferences: PreferenceProfile,
  purchaseHistory: PurchaseHistory[],
) {
  const previousExactPurchase = purchaseHistory.find((purchase) =>
    isSamePurchasedProductForIngredient(ingredient, product, purchase),
  );
  const previousBrandPurchase = purchaseHistory.find(
    (purchase) =>
      productMatchesPurchaseIngredient(ingredient, purchase) &&
      purchase.brand.toLowerCase() === product.brand.toLowerCase(),
  );
  const preferredBrands = preferences.preferred_brands_by_category?.[ingredient.category] ?? [];
  const brandPreferred = preferredBrands.some((brand) => brand.toLowerCase() === product.brand.toLowerCase());

  if (previousExactPurchase) {
    return `Selected ${product.brand} for ${ingredient.name} because you previously ordered ${previousExactPurchase.product_title}.`;
  }

  if (previousBrandPurchase) {
    return `Selected ${product.brand} for ${ingredient.name} because you previously bought this brand for the same ingredient.`;
  }

  if (brandPreferred) {
    return `Selected ${product.brand} for ${ingredient.name} because it matches your saved preference for ${ingredient.category}.`;
  }

  return `Selected for ${ingredient.name} because it is available now and rated ${product.rating}.`;
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
