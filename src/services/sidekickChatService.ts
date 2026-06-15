import { supabase } from "../lib/supabaseClient";

export const SIDEKICK_DEMO_USER_ID = "demo-user";

export type SidekickChatSession = {
  id: string;
  user_id: string;
  title: string;
  active_mode: string | null;
  latest_cart_draft_id: string | null;
  created_at: string;
  updated_at: string;
};

export type SidekickChatMessage = {
  id: string;
  session_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type SidekickCartItem = {
  id: string;
  cart_draft_id: string;
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
  image_url?: string | null;
  alternatives: ProductAlternative[];
  created_at: string;
};

export type ProductAlternative = {
  id: string;
  title: string;
  brand: string;
  price: number;
  rating: number;
  pack_size: string;
  available?: boolean;
  delivery_eta_minutes?: number;
  image_url?: string | null;
};

export type SidekickCartDraft = {
  id: string;
  session_id: string;
  user_id: string;
  title: string;
  mode: string;
  status: "needs_clarification" | "ready_for_review" | "committed";
  review_needed: boolean;
  subtotal: number;
  missing_slots: unknown[];
  evidence: unknown[];
  created_at: string;
  updated_at: string;
  items: SidekickCartItem[];
};

export type SidekickSessionCartItem = {
  id: string;
  session_id: string;
  user_id: string;
  source_cart_draft_ids: string[];
  source_cart_item_ids: string[];
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
  image_url?: string | null;
  alternatives: ProductAlternative[];
  created_at: string;
  updated_at: string;
};

export type AmazonCartItem = {
  id: string;
  user_id: string;
  source_cart_draft_id: string | null;
  source_cart_item_id: string | null;
  product_id: string | null;
  product_title: string;
  brand: string;
  quantity: number;
  unit: string;
  pack_size: string;
  price: number;
  image_url: string | null;
  added_at: string;
  updated_at: string;
};

export type SidekickSchedule = {
  id: string;
  user_id: string;
  session_id: string | null;
  request_text: string;
  schedule_type: "once" | "recurring";
  run_at: string | null;
  recurrence_days: string[];
  recurrence_time: string | null;
  timezone: string;
  next_run_at: string;
  reminder_email: string | null;
  email_reminder_enabled: boolean;
  email_status: "disabled" | "pending_provider" | "queued" | "sent" | "failed";
  status: "active" | "paused" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
};

export type CreateSidekickScheduleInput = {
  sessionId: string | null;
  requestText: string;
  scheduleType: "once" | "recurring";
  runAt: string | null;
  recurrenceDays: string[];
  recurrenceTime: string | null;
  timezone: string;
  nextRunAt: string;
  reminderEmail: string | null;
  emailReminderEnabled: boolean;
  summary: string;
};

type SidekickFunctionResponse = {
  session: SidekickChatSession;
  messages: SidekickChatMessage[];
  cartDraft: SidekickCartDraft | null;
  missingSlots: string[];
};

export type LoadedSidekickSession = {
  session: SidekickChatSession;
  messages: SidekickChatMessage[];
  cartDraft: SidekickCartDraft | null;
  sidekickCartItems: SidekickSessionCartItem[];
};

export type CreatedSidekickSchedule = {
  session: SidekickChatSession;
  messages: SidekickChatMessage[];
  schedule: SidekickSchedule;
};

export async function listSidekickSessions() {
  const { data, error } = await supabase
    .from("sidekick_chat_sessions")
    .select("*")
    .eq("user_id", SIDEKICK_DEMO_USER_ID)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as SidekickChatSession[];
}

export async function createSidekickSession() {
  const { data, error } = await supabase
    .from("sidekick_chat_sessions")
    .insert({
      user_id: SIDEKICK_DEMO_USER_ID,
      title: "New Sidekick chat",
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as SidekickChatSession;
}

export async function listAmazonCartItems() {
  const { data, error } = await supabase
    .from("amazon_cart_items")
    .select("*")
    .eq("user_id", SIDEKICK_DEMO_USER_ID)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as AmazonCartItem[];
}

export async function deleteSidekickSession(sessionId: string) {
  const { error } = await supabase
    .from("sidekick_chat_sessions")
    .delete()
    .eq("id", sessionId)
    .eq("user_id", SIDEKICK_DEMO_USER_ID);

  if (error) {
    throw error;
  }
}

export async function loadSidekickSession(sessionId: string) {
  const { data: session, error: sessionError } = await supabase
    .from("sidekick_chat_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (sessionError) {
    throw sessionError;
  }

  const { data: messages, error: messagesError } = await supabase
    .from("sidekick_chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (messagesError) {
    throw messagesError;
  }

  let cartDraft: SidekickCartDraft | null = null;

  if (session.latest_cart_draft_id) {
    cartDraft = await loadCartDraft(session.latest_cart_draft_id);
  }

  return {
    session: session as SidekickChatSession,
    messages: (messages ?? []) as SidekickChatMessage[],
    cartDraft,
    sidekickCartItems: await loadSidekickSessionCart(sessionId),
  } satisfies LoadedSidekickSession;
}

export async function sendSidekickMessage({
  sessionId,
  message,
  selectedMode,
  imageDataUrl,
  imageName,
}: {
  sessionId: string | null;
  message: string;
  selectedMode: string | null;
  imageDataUrl?: string;
  imageName?: string;
}) {
  const { data, error } = await supabase.functions.invoke<SidekickFunctionResponse>("sidekick-chat", {
    body: {
      userId: SIDEKICK_DEMO_USER_ID,
      sessionId,
      message,
      selectedMode,
      imageDataUrl,
      imageName,
    },
  });

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Sidekick did not return a response.");
  }

  if (!data.cartDraft) {
    return {
      ...data,
      sidekickCartItems: await loadSidekickSessionCart(data.session.id),
    };
  }

  return {
    ...data,
    cartDraft: await loadCartDraft(data.cartDraft.id),
    sidekickCartItems: await loadSidekickSessionCart(data.session.id),
  };
}

export async function loadSidekickSessionCart(sessionId: string) {
  const { data, error } = await supabase
    .from("sidekick_session_cart_items")
    .select("*")
    .eq("session_id", sessionId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as SidekickSessionCartItem[];
}

export async function createSidekickSchedule({
  sessionId,
  requestText,
  scheduleType,
  runAt,
  recurrenceDays,
  recurrenceTime,
  timezone,
  nextRunAt,
  reminderEmail,
  emailReminderEnabled,
  summary,
}: CreateSidekickScheduleInput) {
  const session = sessionId ? await loadExistingSession(sessionId) : await createSidekickSession();
  const emailStatus = emailReminderEnabled ? "pending_provider" : "disabled";

  const { data: schedule, error: scheduleError } = await supabase
    .from("sidekick_schedules")
    .insert({
      user_id: SIDEKICK_DEMO_USER_ID,
      session_id: session.id,
      request_text: requestText,
      schedule_type: scheduleType,
      run_at: runAt,
      recurrence_days: recurrenceDays,
      recurrence_time: recurrenceTime,
      timezone,
      next_run_at: nextRunAt,
      reminder_email: emailReminderEnabled ? reminderEmail : null,
      email_reminder_enabled: emailReminderEnabled,
      email_status: emailStatus,
      status: "active",
    })
    .select("*")
    .single();

  if (scheduleError) {
    throw scheduleError;
  }

  await insertChatMessage(session.id, "user", `Schedule order: ${requestText}`, {
    scheduleType,
    nextRunAt,
  });

  await insertChatMessage(
    session.id,
    "assistant",
    `Scheduled "${requestText}" for ${summary}. ${
      emailReminderEnabled && reminderEmail
        ? `Reminder email saved for ${reminderEmail}.`
        : "Email reminder is off."
    }`,
    {
      scheduleId: schedule.id,
      emailStatus,
    },
  );

  const title = `Scheduled ${requestText}`.slice(0, 42);
  const { data: updatedSession, error: sessionError } = await supabase
    .from("sidekick_chat_sessions")
    .update({
      title,
      active_mode: "schedule",
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.id)
    .select("*")
    .single();

  if (sessionError) {
    throw sessionError;
  }

  return {
    session: updatedSession as SidekickChatSession,
    messages: await loadSessionMessages(session.id),
    schedule: schedule as SidekickSchedule,
  } satisfies CreatedSidekickSchedule;
}

async function loadExistingSession(sessionId: string) {
  const { data, error } = await supabase
    .from("sidekick_chat_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", SIDEKICK_DEMO_USER_ID)
    .single();

  if (error) {
    throw error;
  }

  return data as SidekickChatSession;
}

async function insertChatMessage(
  sessionId: string,
  role: SidekickChatMessage["role"],
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

async function loadSessionMessages(sessionId: string) {
  const { data, error } = await supabase
    .from("sidekick_chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as SidekickChatMessage[];
}

export async function addMiniCartToSidekickCart(cartDraft: SidekickCartDraft) {
  let existingItems = await loadSidekickSessionCart(cartDraft.session_id);

  for (const item of cartDraft.items) {
    const existingItem = findMergeTarget(existingItems, item);

    if (existingItem) {
      const nextQuantity = Number(existingItem.quantity ?? 0) + Number(item.quantity ?? 0);
      const nextPrice = Number((Number(existingItem.price ?? 0) + Number(item.price ?? 0)).toFixed(2));
      const nextDraftIds = uniqueStrings([...existingItem.source_cart_draft_ids, cartDraft.id]);
      const nextItemIds = uniqueStrings([...existingItem.source_cart_item_ids, item.id]);

      const { error } = await supabase
        .from("sidekick_session_cart_items")
        .update({
          source_cart_draft_ids: nextDraftIds,
          source_cart_item_ids: nextItemIds,
          quantity: nextQuantity,
          price: nextPrice,
          reason: `${existingItem.reason} Added again from ${cartDraft.title}.`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id);

      if (error) {
        throw error;
      }

      existingItems = existingItems.map((existing) =>
        existing.id === existingItem.id
          ? {
              ...existing,
              source_cart_draft_ids: nextDraftIds,
              source_cart_item_ids: nextItemIds,
              quantity: nextQuantity,
              price: nextPrice,
            }
          : existing,
      );
      continue;
    }

    const { error } = await supabase.from("sidekick_session_cart_items").insert({
      session_id: cartDraft.session_id,
      user_id: cartDraft.user_id,
      source_cart_draft_ids: [cartDraft.id],
      source_cart_item_ids: [item.id],
      requirement_name: item.requirement_name,
      product_id: item.product_id,
      product_title: item.product_title,
      brand: item.brand,
      quantity: item.quantity,
      unit: item.unit,
      pack_size: item.pack_size,
      price: item.price,
      rating: item.rating,
      available: item.available,
      delivery_eta_minutes: item.delivery_eta_minutes,
      reason: item.reason,
      image_url: item.image_url ?? null,
      alternatives: item.alternatives,
    });

    if (error) {
      throw error;
    }

    existingItems = await loadSidekickSessionCart(cartDraft.session_id);
  }

  await touchSession(cartDraft.session_id);
  return loadSidekickSessionCart(cartDraft.session_id);
}

export async function commitSidekickCart(sessionId: string) {
  const sidekickCartItems = await loadSidekickSessionCart(sessionId);

  for (const item of sidekickCartItems) {
    await addSessionCartItemToAmazonCart(item);
  }

  const { error } = await supabase
    .from("sidekick_session_cart_items")
    .delete()
    .eq("session_id", sessionId);

  if (error) {
    throw error;
  }

  await touchSession(sessionId);
  return listAmazonCartItems();
}

async function addSessionCartItemToAmazonCart(item: SidekickSessionCartItem) {
  if (item.product_id) {
    const { data: existingItem, error: existingError } = await supabase
      .from("amazon_cart_items")
      .select("*")
      .eq("user_id", SIDEKICK_DEMO_USER_ID)
      .eq("product_id", item.product_id)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existingItem) {
      const { error } = await supabase
        .from("amazon_cart_items")
        .update({
          source_cart_draft_id: item.source_cart_draft_ids[0] ?? null,
          source_cart_item_id: item.source_cart_item_ids[0] ?? null,
          quantity: Number(existingItem.quantity ?? 0) + Number(item.quantity ?? 0),
          price: Number((Number(existingItem.price ?? 0) + Number(item.price ?? 0)).toFixed(2)),
          product_title: item.product_title,
          brand: item.brand,
          unit: item.unit,
          pack_size: item.pack_size,
          image_url: item.image_url ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id);

      if (error) {
        throw error;
      }

      return;
    }
  }

  const { error } = await supabase.from("amazon_cart_items").insert({
    user_id: SIDEKICK_DEMO_USER_ID,
    source_cart_draft_id: item.source_cart_draft_ids[0] ?? null,
    source_cart_item_id: item.source_cart_item_ids[0] ?? null,
    product_id: item.product_id,
    product_title: item.product_title,
    brand: item.brand,
    quantity: item.quantity,
    unit: item.unit,
    pack_size: item.pack_size,
    price: item.price,
    image_url: item.image_url ?? null,
  });

  if (error) {
    throw error;
  }
}

export async function emptySidekickCart(sessionId: string) {
  const { error } = await supabase
    .from("sidekick_session_cart_items")
    .delete()
    .eq("session_id", sessionId);

  if (error) {
    throw error;
  }

  await touchSession(sessionId);
  return [] as SidekickSessionCartItem[];
}

export async function updateCartItemQuantity(cartDraft: SidekickCartDraft, item: SidekickCartItem, quantity: number) {
  const nextQuantity = Math.max(1, quantity);
  const unitPrice = item.quantity > 0 ? item.price / item.quantity : item.price;

  const { error } = await supabase
    .from("sidekick_cart_items")
    .update({
      quantity: nextQuantity,
      price: Number((unitPrice * nextQuantity).toFixed(2)),
    })
    .eq("id", item.id);

  if (error) {
    throw error;
  }

  await refreshCartSubtotal(cartDraft.id);
  return loadCartDraft(cartDraft.id);
}

export async function removeCartItem(cartDraft: SidekickCartDraft, itemId: string) {
  const { error } = await supabase
    .from("sidekick_cart_items")
    .delete()
    .eq("id", itemId);

  if (error) {
    throw error;
  }

  await refreshCartSubtotal(cartDraft.id);
  return loadCartDraft(cartDraft.id);
}

export async function replaceCartItemProduct(
  cartDraft: SidekickCartDraft,
  item: SidekickCartItem,
  alternative: ProductAlternative,
) {
  const { error } = await supabase
    .from("sidekick_cart_items")
    .update({
      product_id: alternative.id,
      product_title: alternative.title,
      brand: alternative.brand,
      pack_size: alternative.pack_size,
      price: Number((alternative.price * item.quantity).toFixed(2)),
      rating: alternative.rating,
      available: alternative.available ?? true,
      delivery_eta_minutes: alternative.delivery_eta_minutes ?? item.delivery_eta_minutes,
      reason: `Changed to ${alternative.brand} after your selection.`,
    })
    .eq("id", item.id);

  if (error) {
    throw error;
  }

  await refreshCartSubtotal(cartDraft.id);
  return loadCartDraft(cartDraft.id);
}

export async function updateSidekickCartItemQuantity(item: SidekickSessionCartItem, quantity: number) {
  const nextQuantity = Math.max(1, quantity);
  const unitPrice = item.quantity > 0 ? item.price / item.quantity : item.price;

  const { error } = await supabase
    .from("sidekick_session_cart_items")
    .update({
      quantity: nextQuantity,
      price: Number((unitPrice * nextQuantity).toFixed(2)),
      updated_at: new Date().toISOString(),
    })
    .eq("id", item.id);

  if (error) {
    throw error;
  }

  await touchSession(item.session_id);
  return loadSidekickSessionCart(item.session_id);
}

export async function removeSidekickCartItem(item: SidekickSessionCartItem) {
  const { error } = await supabase
    .from("sidekick_session_cart_items")
    .delete()
    .eq("id", item.id);

  if (error) {
    throw error;
  }

  await touchSession(item.session_id);
  return loadSidekickSessionCart(item.session_id);
}

export async function replaceSidekickCartItemProduct(
  item: SidekickSessionCartItem,
  alternative: ProductAlternative,
) {
  const { error } = await supabase
    .from("sidekick_session_cart_items")
    .update({
      product_id: alternative.id,
      product_title: alternative.title,
      brand: alternative.brand,
      pack_size: alternative.pack_size,
      price: Number((alternative.price * item.quantity).toFixed(2)),
      rating: alternative.rating,
      available: alternative.available ?? true,
      delivery_eta_minutes: alternative.delivery_eta_minutes ?? item.delivery_eta_minutes,
      reason: `Changed to ${alternative.brand} after your selection.`,
      image_url: alternative.image_url ?? item.image_url ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", item.id);

  if (error) {
    throw error;
  }

  await touchSession(item.session_id);
  return loadSidekickSessionCart(item.session_id);
}

export async function loadCartDraft(cartDraftId: string) {
  const { data: draft, error: draftError } = await supabase
    .from("sidekick_cart_drafts")
    .select("*")
    .eq("id", cartDraftId)
    .single();

  if (draftError) {
    throw draftError;
  }

  const { data: items, error: itemsError } = await supabase
    .from("sidekick_cart_items")
    .select("*")
    .eq("cart_draft_id", cartDraftId)
    .order("created_at", { ascending: true });

  if (itemsError) {
    throw itemsError;
  }

  const hydratedItems = await hydrateCartItems((items ?? []) as SidekickCartItem[]);

  return {
    ...(draft as Omit<SidekickCartDraft, "items">),
    items: hydratedItems,
  };
}

async function refreshCartSubtotal(cartDraftId: string) {
  const { data, error: itemsError } = await supabase
    .from("sidekick_cart_items")
    .select("price")
    .eq("cart_draft_id", cartDraftId);

  if (itemsError) {
    throw itemsError;
  }

  const subtotal = (data ?? []).reduce((total, item) => total + Number(item.price ?? 0), 0);

  const { error: draftError } = await supabase
    .from("sidekick_cart_drafts")
    .update({
      subtotal,
      updated_at: new Date().toISOString(),
    })
    .eq("id", cartDraftId);

  if (draftError) {
    throw draftError;
  }
}

async function hydrateCartItems(items: SidekickCartItem[]) {
  const productIds = items
    .map((item) => item.product_id)
    .filter((productId): productId is string => Boolean(productId));

  if (productIds.length === 0) {
    return items;
  }

  const { data, error } = await supabase
    .from("product_catalog")
    .select("id, title, brand, price, rating, pack_size, image_url")
    .in("id", productIds);

  if (error) {
    throw error;
  }

  const productById = new Map(
    (data ?? []).map((product) => [
      product.id,
      product as ProductAlternative,
    ]),
  );

  return items.map((item) => ({
    ...item,
    image_url: item.product_id ? productById.get(item.product_id)?.image_url ?? null : null,
  }));
}

function findMergeTarget(existingItems: SidekickSessionCartItem[], item: SidekickCartItem) {
  if (item.product_id) {
    const productMatch = existingItems.find((existingItem) => existingItem.product_id === item.product_id);
    if (productMatch) {
      return productMatch;
    }
  }

  return existingItems.find(
    (existingItem) =>
      !existingItem.product_id &&
      existingItem.product_title.toLowerCase() === item.product_title.toLowerCase() &&
      existingItem.brand.toLowerCase() === item.brand.toLowerCase() &&
      existingItem.pack_size.toLowerCase() === item.pack_size.toLowerCase(),
  );
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

async function touchSession(sessionId: string) {
  const { error } = await supabase
    .from("sidekick_chat_sessions")
    .update({
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (error) {
    throw error;
  }
}
