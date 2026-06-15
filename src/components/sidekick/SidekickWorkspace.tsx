import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  CalendarClock,
  CheckCircle2,
  Eye,
  Minus,
  Mic,
  Paperclip,
  Plus,
  ShoppingCart,
  Sparkles,
  Square,
  Trash2,
  X,
} from "lucide-react";
import ProductRecommendationCard from "./ProductRecommendationCard";
import { sidekickModes } from "../../data/sidekickUiData";
import type { SidekickMode } from "../../data/sidekickUiData";
import {
  addMiniCartToSidekickCart,
  commitSidekickCart,
  createSidekickSchedule,
  createSidekickSession,
  deleteSidekickSession,
  emptySidekickCart,
  listAmazonCartItems,
  listSidekickSessions,
  loadSidekickSessionCart,
  loadSidekickSession,
  removeCartItem,
  removeSidekickCartItem,
  replaceCartItemProduct,
  replaceSidekickCartItemProduct,
  sendSidekickMessage,
  updateSidekickCartItemQuantity,
  updateCartItemQuantity,
} from "../../services/sidekickChatService";
import type {
  AmazonCartItem,
  ProductAlternative,
  SidekickCartDraft,
  SidekickCartItem,
  SidekickChatMessage,
  SidekickChatSession,
  SidekickSessionCartItem,
} from "../../services/sidekickChatService";

type SidekickWorkspaceProps = {
  onClose: () => void;
  onAmazonCartUpdated?: () => void;
};

type CartStage = "empty" | "mini" | "sidekick" | "amazon";
type CartPreviewMode = "mini" | "sidekick" | null;
type SelectedCartItem = {
  source: "mini" | "sidekick";
  item: SidekickCartItem | SidekickSessionCartItem;
};

type ScheduleKind = "once" | "recurring";
type ScheduleDraft = {
  kind: ScheduleKind;
  date: string;
  time: string;
  days: string[];
  emailReminderEnabled: boolean;
  reminderEmail: string;
};

type BrowserSpeechRecognitionResult = {
  isFinal: boolean;
  length: number;
  [index: number]: {
    transcript: string;
  };
};

type BrowserSpeechRecognitionResultList = {
  length: number;
  [index: number]: BrowserSpeechRecognitionResult;
};

type BrowserSpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onresult: ((event: { results: BrowserSpeechRecognitionResultList }) => void) | null;
};

type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: new () => BrowserSpeechRecognition;
  webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
};

const SIDEKICK_PROGRESS_STEPS = [
  "Understanding your request",
  "Finding required items",
  "Checking your previous brand preferences",
  "Preparing product options",
  "Building your Mini Cart",
];

const SCHEDULE_DAYS = [
  { id: "mon", shortLabel: "Mon", label: "Monday", dayIndex: 1 },
  { id: "tue", shortLabel: "Tue", label: "Tuesday", dayIndex: 2 },
  { id: "wed", shortLabel: "Wed", label: "Wednesday", dayIndex: 3 },
  { id: "thu", shortLabel: "Thu", label: "Thursday", dayIndex: 4 },
  { id: "fri", shortLabel: "Fri", label: "Friday", dayIndex: 5 },
  { id: "sat", shortLabel: "Sat", label: "Saturday", dayIndex: 6 },
  { id: "sun", shortLabel: "Sun", label: "Sunday", dayIndex: 0 },
];

const WEEKDAY_IDS = ["mon", "tue", "wed", "thu", "fri"];
const DEFAULT_REMINDER_EMAIL = "demo.user@example.com";

export default function SidekickWorkspace({ onClose, onAmazonCartUpdated }: SidekickWorkspaceProps) {
  const threadEndRef = useRef<HTMLDivElement | null>(null);
  const speechRecognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const listImageInputRef = useRef<HTMLInputElement | null>(null);
  const [activeMode, setActiveMode] = useState<SidekickMode | null>(null);
  const [sessions, setSessions] = useState<SidekickChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<SidekickChatMessage[]>([]);
  const [cartDraft, setCartDraft] = useState<SidekickCartDraft | null>(null);
  const [sidekickCartItems, setSidekickCartItems] = useState<SidekickSessionCartItem[]>([]);
  const [amazonCartItems, setAmazonCartItems] = useState<AmazonCartItem[]>([]);
  const [cartStage, setCartStage] = useState<CartStage>("empty");
  const [previewMode, setPreviewMode] = useState<CartPreviewMode>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputStatus, setInputStatus] = useState<string | null>(null);
  const [utilityMenuOpen, setUtilityMenuOpen] = useState(false);
  const [isScheduleToolActive, setIsScheduleToolActive] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleDraft, setScheduleDraft] = useState<ScheduleDraft>(() => createDefaultScheduleDraft());
  const [progressStepIndex, setProgressStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cartNotice, setCartNotice] = useState<string | null>(null);
  const [selectedCartItem, setSelectedCartItem] = useState<SelectedCartItem | null>(null);

  useEffect(() => {
    void refreshSessions();
    void refreshAmazonCart();
  }, []);

  useEffect(() => {
    if (!isGenerating) {
      setProgressStepIndex(0);
      return;
    }

    const progressTimer = window.setInterval(() => {
      setProgressStepIndex((currentStep) =>
        Math.min(currentStep + 1, SIDEKICK_PROGRESS_STEPS.length - 1),
      );
    }, 950);

    return () => window.clearInterval(progressTimer);
  }, [isGenerating]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, cartDraft, isGenerating, errorMessage, cartNotice]);

  useEffect(() => {
    return () => {
      speechRecognitionRef.current?.abort();
    };
  }, []);

  async function refreshSessions() {
    const nextSessions = await listSidekickSessions();
    setSessions(nextSessions);
  }

  async function refreshAmazonCart() {
    const nextAmazonCartItems = await listAmazonCartItems();
    setAmazonCartItems(nextAmazonCartItems);
  }

  async function refreshSidekickCart(sessionId: string | null = currentSessionId) {
    if (!sessionId) {
      setSidekickCartItems([]);
      return [];
    }

    const nextSidekickCartItems = await loadSidekickSessionCart(sessionId);
    setSidekickCartItems(nextSidekickCartItems);
    return nextSidekickCartItems;
  }

  async function handleNewChat() {
    setErrorMessage(null);

    try {
      const session = await createSidekickSession();
      setCurrentSessionId(session.id);
      setMessages([]);
      setCartDraft(null);
      setSidekickCartItems([]);
      setCartStage("empty");
      setPreviewMode(null);
      setCartNotice(null);
      setSelectedCartItem(null);
      setActiveMode(null);
      await refreshSessions();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  async function handleLoadSession(sessionId: string) {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const loaded = await loadSidekickSession(sessionId);
      setCurrentSessionId(loaded.session.id);
      setMessages(loaded.messages);
      setCartDraft(loaded.cartDraft);
      setSidekickCartItems(loaded.sidekickCartItems);
      setCartStage(loaded.sidekickCartItems.length ? "sidekick" : getLoadedCartStage(loaded.cartDraft));
      setPreviewMode(null);
      setCartNotice(null);
      setSelectedCartItem(null);
      setActiveMode(findModeFromStoredValue(loaded.session.active_mode));

      if (loaded.cartDraft?.status === "committed") {
        await refreshAmazonCart();
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteSession(session: SidekickChatSession) {
    if (isLoading) {
      return;
    }

    const shouldDelete = window.confirm(`Delete "${session.title}"?`);
    if (!shouldDelete) {
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      await deleteSidekickSession(session.id);

      if (session.id === currentSessionId) {
        setCurrentSessionId(null);
        setMessages([]);
        setCartDraft(null);
        setSidekickCartItems([]);
        setCartStage("empty");
        setPreviewMode(null);
        setCartNotice(null);
        setSelectedCartItem(null);
        setActiveMode(null);
      }

      await refreshSessions();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = inputValue.trim();
    if (!message || isLoading) {
      if (isScheduleToolActive && !message) {
        setInputStatus("Type what Sidekick should order on this schedule.");
      }
      return;
    }

    if (isScheduleToolActive) {
      await handleCreateSchedule(message);
      return;
    }

    const previousCartDraft = cartDraft;
    speechRecognitionRef.current?.stop();
    setInputValue("");
    setErrorMessage(null);
    setCartNotice(null);
    setInputStatus(null);
    setCartDraft(null);
    setMessages((currentMessages) => [
      ...currentMessages,
      createOptimisticUserMessage(currentSessionId, message),
    ]);
    setIsLoading(true);
    setIsGenerating(true);

    try {
      const response = await sendSidekickMessage({
        sessionId: currentSessionId,
        message,
        selectedMode: activeMode?.name ?? null,
      });

      setCurrentSessionId(response.session.id);
      setMessages(response.messages);
      setCartDraft(response.cartDraft);
      setSidekickCartItems(response.sidekickCartItems);
      setCartStage(response.cartDraft ? "mini" : response.sidekickCartItems.length ? "sidekick" : "empty");
      setPreviewMode(null);
      setSelectedCartItem(null);
      setActiveMode(findModeFromStoredValue(response.session.active_mode) ?? activeMode);
      await refreshSessions();
    } catch (error) {
      setInputValue(message);
      setCartDraft(previousCartDraft);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  }

  function handleVoiceInput() {
    if (isLoading) {
      return;
    }

    if (isListening) {
      speechRecognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = getSpeechRecognitionConstructor();
    if (!SpeechRecognition) {
      setInputStatus("Voice input is not available in this browser. In Brave, allow microphone access or try Chrome.");
      return;
    }

    let capturedTranscript = "";
    let didError = false;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setInputStatus("Listening in English. Speak now.");
    };

    recognition.onresult = (event) => {
      const transcript = getTranscriptFromSpeechResults(event.results);
      if (!transcript) {
        return;
      }

      capturedTranscript = transcript;
      setInputValue(transcript);
      setInputStatus("Transcript ready. Review it, then send.");
    };

    recognition.onerror = (event) => {
      didError = true;
      setIsListening(false);
      setInputStatus(getVoiceErrorMessage(event.error));

      if (speechRecognitionRef.current === recognition) {
        speechRecognitionRef.current = null;
      }
    };

    recognition.onend = () => {
      setIsListening(false);

      if (speechRecognitionRef.current === recognition) {
        speechRecognitionRef.current = null;
      }

      if (didError) {
        return;
      }

      setInputStatus(capturedTranscript ? "Transcript ready. Review it, then send." : "No speech captured. Try again.");
    };

    speechRecognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      speechRecognitionRef.current = null;
      setIsListening(false);
      setInputStatus("Voice input could not start. Close other mic sessions and try again.");
    }
  }

  function handleOpenImagePicker() {
    setUtilityMenuOpen(false);
    listImageInputRef.current?.click();
  }

  function handleScheduleTask() {
    setUtilityMenuOpen(false);
    setIsScheduleToolActive(true);
    setScheduleModalOpen(true);
    setInputStatus("Choose a schedule, then type what Sidekick should order.");
  }

  function handleOpenScheduleSettings() {
    setScheduleModalOpen(true);
    setInputStatus(null);
  }

  function handleCancelScheduleMode() {
    setIsScheduleToolActive(false);
    setScheduleModalOpen(false);
    setScheduleDraft(createDefaultScheduleDraft());
    setInputStatus(null);
  }

  async function handleCreateSchedule(requestText: string) {
    const schedulePayload = buildSchedulePayload(scheduleDraft, requestText);

    if (!schedulePayload.ok) {
      setInputStatus(schedulePayload.error);
      setScheduleModalOpen(true);
      return;
    }

    setInputValue("");
    setErrorMessage(null);
    setCartNotice(null);
    setInputStatus(null);
    setMessages((currentMessages) => [
      ...currentMessages,
      createOptimisticUserMessage(currentSessionId, `Schedule order: ${requestText}`),
    ]);
    setIsLoading(true);

    try {
      const response = await createSidekickSchedule({
        sessionId: currentSessionId,
        requestText,
        scheduleType: schedulePayload.scheduleType,
        runAt: schedulePayload.runAt,
        recurrenceDays: schedulePayload.recurrenceDays,
        recurrenceTime: schedulePayload.recurrenceTime,
        timezone: schedulePayload.timezone,
        nextRunAt: schedulePayload.nextRunAt,
        reminderEmail: schedulePayload.reminderEmail,
        emailReminderEnabled: schedulePayload.emailReminderEnabled,
        summary: schedulePayload.summary,
      });

      setCurrentSessionId(response.session.id);
      setMessages(response.messages);
      setActiveMode(findModeFromStoredValue(response.session.active_mode));
      setIsScheduleToolActive(false);
      setScheduleModalOpen(false);
      setScheduleDraft(createDefaultScheduleDraft());
      setCartNotice(`Schedule placed for ${schedulePayload.summary}.`);
      await refreshSessions();
    } catch (error) {
      setInputValue(requestText);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleListImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || isLoading) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setInputStatus("Upload an image file of your grocery list.");
      return;
    }

    if (file.size > 6 * 1024 * 1024) {
      setInputStatus("Use an image under 6 MB for list upload.");
      return;
    }

    const message = `Uploaded grocery list image: ${file.name}`;
    const previousCartDraft = cartDraft;
    setInputValue("");
    setErrorMessage(null);
    setCartNotice(null);
    setInputStatus("Reading grocery list image...");
    setCartDraft(null);
    setMessages((currentMessages) => [
      ...currentMessages,
      createOptimisticUserMessage(currentSessionId, message),
    ]);
    setIsLoading(true);
    setIsGenerating(true);

    try {
      const imageDataUrl = await readFileAsDataUrl(file);
      const response = await sendSidekickMessage({
        sessionId: currentSessionId,
        message,
        selectedMode: "Upload List",
        imageDataUrl,
        imageName: file.name,
      });

      setCurrentSessionId(response.session.id);
      setMessages(response.messages);
      setCartDraft(response.cartDraft);
      setSidekickCartItems(response.sidekickCartItems);
      setCartStage(response.cartDraft ? "mini" : response.sidekickCartItems.length ? "sidekick" : "empty");
      setPreviewMode(null);
      setSelectedCartItem(null);
      setActiveMode(findModeFromStoredValue(response.session.active_mode));
      setInputStatus(response.cartDraft ? "Image list converted. Review the Mini Cart." : null);
      await refreshSessions();
    } catch (error) {
      setCartDraft(previousCartDraft);
      setErrorMessage(getErrorMessage(error));
      setInputStatus("Image upload could not be converted. Try a clearer list photo.");
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  }

  function handlePreviewMiniCart() {
    if (!cartDraft) {
      return;
    }

    setPreviewMode("mini");
  }

  async function handleAddToSidekickCart() {
    if (!cartDraft) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const nextSidekickCartItems = await addMiniCartToSidekickCart(cartDraft);
      setSidekickCartItems(nextSidekickCartItems);
      setCartStage("sidekick");
      setPreviewMode(null);
      setCartNotice("Mini Cart merged into Sidekick Cart.");
      await refreshSessions();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  function handlePreviewSidekickCart() {
    if (sidekickCartItems.length === 0) {
      return;
    }

    setPreviewMode("sidekick");
  }

  async function handleAddToAmazonCart() {
    if (!currentSessionId || sidekickCartItems.length === 0) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const nextAmazonCartItems = await commitSidekickCart(currentSessionId);
      setAmazonCartItems(nextAmazonCartItems);
      setSidekickCartItems([]);
      setCartStage("amazon");
      setPreviewMode(null);
      setCartNotice(`Added ${sidekickCartItems.length} Sidekick Cart items to Amazon Cart.`);
      onAmazonCartUpdated?.();
      await refreshSessions();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEmptySidekickCart() {
    if (!currentSessionId || sidekickCartItems.length === 0) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await emptySidekickCart(currentSessionId);
      setSidekickCartItems([]);
      setCartStage(cartDraft ? "mini" : "empty");
      setPreviewMode(null);
      setSelectedCartItem(null);
      setCartNotice("Sidekick Cart emptied.");
      await refreshSessions();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleQuantityChange(item: SidekickCartItem | SidekickSessionCartItem, quantity: number) {
    if (previewMode === "mini" && !cartDraft) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (previewMode === "sidekick" && isSidekickSessionCartItem(item)) {
        const updatedItems = await updateSidekickCartItemQuantity(item, quantity);
        setSidekickCartItems(updatedItems);
      } else if (cartDraft && isMiniCartItem(item)) {
        const updatedCart = await updateCartItemQuantity(cartDraft, item, quantity);
        setCartDraft(updatedCart);
      }
      setCartNotice("Quantity updated.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemoveItem(item: SidekickCartItem | SidekickSessionCartItem) {
    if (previewMode === "mini" && !cartDraft) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (previewMode === "sidekick" && isSidekickSessionCartItem(item)) {
        const updatedItems = await removeSidekickCartItem(item);
        setSidekickCartItems(updatedItems);
      } else if (cartDraft && isMiniCartItem(item)) {
        const updatedCart = await removeCartItem(cartDraft, item.id);
        setCartDraft(updatedCart);
      }
      setSelectedCartItem(null);
      setCartNotice("Item removed from cart.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleReplaceItem(selection: SelectedCartItem, alternative: ProductAlternative) {
    if (selection.source === "mini" && !cartDraft) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (selection.source === "sidekick" && isSidekickSessionCartItem(selection.item)) {
        const updatedItems = await replaceSidekickCartItemProduct(selection.item, alternative);
        setSidekickCartItems(updatedItems);
      } else if (cartDraft && isMiniCartItem(selection.item)) {
        const updatedCart = await replaceCartItemProduct(cartDraft, selection.item, alternative);
        setCartDraft(updatedCart);
      }
      setSelectedCartItem(null);
      setCartNotice("Product changed.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  const isLatestMiniCartAdded = Boolean(
    cartDraft && sidekickCartItems.some((item) => item.source_cart_draft_ids.includes(cartDraft.id)),
  );
  const canPreviewSidekickCart = sidekickCartItems.length > 0;
  const canAddToAmazonCart = sidekickCartItems.length > 0;
  const panelStage: CartStage =
    cartStage === "amazon" ? "amazon" : sidekickCartItems.length > 0 ? "sidekick" : cartDraft ? "mini" : "empty";
  const cartPanelTitle = getCartPanelTitle(panelStage);
  const cartPanelItems =
    panelStage === "amazon" ? amazonCartItems : panelStage === "sidekick" ? sidekickCartItems : cartDraft?.items ?? [];
  const cartPanelSubtotal =
    panelStage === "amazon"
      ? sumPrices(amazonCartItems)
      : panelStage === "sidekick"
        ? sumPrices(sidekickCartItems)
        : cartDraft?.subtotal ?? 0;
  const cartPanelHeading =
    panelStage === "amazon"
      ? "Amazon Cart"
      : panelStage === "sidekick"
        ? "Sidekick Cart"
        : cartDraft?.title ?? "No cart yet";
  const previewItems = previewMode === "sidekick" ? sidekickCartItems : cartDraft?.items ?? [];
  const previewSubtotal = previewMode === "sidekick" ? sumPrices(sidekickCartItems) : cartDraft?.subtotal ?? 0;
  const previewTitle = previewMode === "sidekick" ? "Sidekick Cart" : cartDraft?.title ?? "Mini Cart";

  return (
    <div className="sidekick-overlay" role="dialog" aria-modal="true" aria-label="Amazon Sidekick workspace">
      <div className="sidekick-workspace">
        <aside className="sidekick-sidebar">
          <div className="sidekick-brand">
            <span>
              <Sparkles size={18} />
            </span>
            <div>
              <strong>Amazon Sidekick</strong>
              <small>Shopping sessions</small>
            </div>
          </div>

          <button className="new-chat-button" type="button" onClick={handleNewChat} disabled={isLoading}>
            New Sidekick chat
          </button>

          <nav aria-label="Previous Sidekick chats">
            <h3>Previous Sidekick Chats</h3>
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <div
                  className={session.id === currentSessionId ? "active" : ""}
                  key={session.id}
                >
                  <button
                    className="sidekick-session-open"
                    type="button"
                    onClick={() => void handleLoadSession(session.id)}
                    disabled={isLoading}
                  >
                    {session.title}
                  </button>
                  <button
                    className="sidekick-session-delete"
                    type="button"
                    aria-label={`Delete ${session.title}`}
                    onClick={() => void handleDeleteSession(session)}
                    disabled={isLoading}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            ) : (
              <p className="empty-chat-list">No saved chats yet.</p>
            )}
          </nav>
        </aside>

        <section className="sidekick-chat">
          <header className="sidekick-chat-header">
            <div>
              <span>Amazon Sidekick</span>
              <h2>From need to cart in seconds.</h2>
            </div>
            <div className="sidekick-header-actions">
              <button type="button" disabled={!canPreviewSidekickCart} onClick={handlePreviewSidekickCart}>
                Preview Sidekick Cart
              </button>
              <button type="button" disabled={!canAddToAmazonCart || isLoading} onClick={() => void handleAddToAmazonCart()}>
                Add to Amazon Cart
              </button>
              <button type="button" aria-label="Close Sidekick" onClick={onClose}>
                <X size={20} />
              </button>
            </div>
          </header>

          <div className="mode-grid" aria-label="Sidekick modes">
            {sidekickModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  className={mode.name === activeMode?.name ? "active" : ""}
                  type="button"
                  key={mode.name}
                  onClick={() => setActiveMode(mode)}
                >
                  <Icon size={18} />
                  {mode.name}
                </button>
              );
            })}
          </div>

          <div className="sidekick-thread">
            {messages.length > 0 ? (
              messages.map((message) => (
                <article
                  className={`sidekick-message ${message.role === "user" ? "user" : "assistant"}`}
                  key={message.id}
                >
                  <span>{message.role === "user" ? "You" : "Sidekick"}</span>
                  <p>{message.content}</p>
                </article>
              ))
            ) : (
              <div className="sidekick-empty-state">
                <span>Sidekick</span>
                <h3>{activeMode ? activeMode.name : "Start a Sidekick chat"}</h3>
                <p>
                  {activeMode
                    ? activeMode.prompt
                    : "Choose a mode or describe what you need. Try: I want to make paneer butter masala for 4 people."}
                </p>
              </div>
            )}

            {cartDraft?.items.length && !isGenerating ? (
              <article className="sidekick-message assistant wide">
                <span>Mini Cart</span>
                <p className="progress-line">
                  Matched {cartDraft.items.length} ingredients to products. Review the cards before adding them to
                  your Sidekick Cart.
                </p>

                <div className="sidekick-products">
                  {cartDraft.items.map((item) => (
                    <ProductRecommendationCard
                      product={mapCartItemToProductCard(item)}
                      key={item.id}
                      onChange={() => setSelectedCartItem({ source: "mini", item })}
                    />
                  ))}
                </div>

                <div className="mini-cart-actions">
                  <button type="button" onClick={handlePreviewMiniCart}>
                    <Eye size={16} />
                    Preview Mini Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleAddToSidekickCart()}
                    disabled={isLatestMiniCartAdded || isLoading}
                  >
                    <CheckCircle2 size={16} />
                    {isLatestMiniCartAdded ? "Added to Sidekick Cart" : "Add to Sidekick Cart"}
                  </button>
                </div>
              </article>
            ) : null}

            {isGenerating ? (
              <article className="sidekick-message assistant">
                <span>Sidekick</span>
                <div className="sidekick-progress-steps" aria-live="polite">
                  {SIDEKICK_PROGRESS_STEPS.map((step, index) => (
                    <div
                      className={[
                        "sidekick-progress-step",
                        index < progressStepIndex ? "done" : "",
                        index === progressStepIndex ? "active" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      key={step}
                    >
                      <span aria-hidden="true" />
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </article>
            ) : null}

            {errorMessage ? (
              <div className="sidekick-error" role="alert">
                {errorMessage}
              </div>
            ) : null}

            {cartNotice ? (
              <div className="sidekick-notice" role="status">
                {cartNotice}
              </div>
            ) : null}

            <div className="sidekick-thread-end" ref={threadEndRef} aria-hidden="true" />
          </div>

          <form
            className={`sidekick-input-bar ${isScheduleToolActive ? "schedule-enabled" : ""}`}
            onSubmit={handleSubmit}
          >
            <div className="sidekick-utility-menu-wrap">
              <button
                className={utilityMenuOpen ? "utility-active" : ""}
                type="button"
                aria-label="More Sidekick tools"
                aria-expanded={utilityMenuOpen}
                disabled={isLoading}
                onClick={() => setUtilityMenuOpen((isOpen) => !isOpen)}
                title="More tools"
              >
                <Plus size={20} />
              </button>
              {utilityMenuOpen ? (
                <div className="sidekick-utility-menu" role="menu">
                  <button type="button" role="menuitem" onClick={handleScheduleTask}>
                    <CalendarClock size={17} />
                    Schedule task
                  </button>
                </div>
              ) : null}
            </div>
            <input
              aria-label="Message Sidekick"
              placeholder={
                isScheduleToolActive
                  ? "What should Sidekick order on this schedule?"
                  : "Tell Sidekick what you need right now..."
              }
              value={inputValue}
              onChange={(event) => {
                setInputValue(event.target.value);
                setInputStatus(null);
              }}
              disabled={isLoading}
            />
            {isScheduleToolActive ? (
              <button
                className="schedule-active"
                type="button"
                aria-label="Edit schedule"
                aria-pressed={scheduleModalOpen}
                disabled={isLoading}
                onClick={handleOpenScheduleSettings}
                title="Edit schedule"
              >
                <CalendarClock size={20} />
              </button>
            ) : null}
            <button
              className={isListening ? "voice-active" : ""}
              type="button"
              aria-label={isListening ? "Stop listening" : "Speak"}
              aria-pressed={isListening}
              disabled={isLoading}
              onClick={handleVoiceInput}
              title={isListening ? "Stop listening" : "Speak in English"}
            >
              <Mic size={20} />
            </button>
            <button
              type="button"
              aria-label="Upload list image"
              disabled={isLoading}
              onClick={handleOpenImagePicker}
              title="Upload list image"
            >
              <Paperclip size={20} />
            </button>
            <input
              ref={listImageInputRef}
              className="sidekick-file-input"
              type="file"
              accept="image/*"
              onChange={(event) => void handleListImageChange(event)}
            />
            {isGenerating ? (
              <button className="sidekick-processing-button" type="button" aria-label="Sidekick is working" disabled>
                <Square size={16} fill="currentColor" />
              </button>
            ) : (
              <button
                className="sidekick-send-button"
                type="submit"
                aria-label="Send"
                disabled={isLoading || !inputValue.trim()}
              >
                <ArrowUp size={21} />
              </button>
            )}
            {inputStatus ? (
              <p className="sidekick-input-status" role="status" aria-live="polite">
                {inputStatus}
              </p>
            ) : null}
          </form>
        </section>

        <aside className="sidekick-cart-panel">
          <div className="cart-panel-header">
            <span>
              <ShoppingCart size={18} />
              {cartPanelTitle}
            </span>
            <strong>Rs.{formatPrice(cartPanelSubtotal)}</strong>
          </div>

          <div className="cart-panel-title">
            <h3>{cartPanelHeading}</h3>
            <p>
              {cartPanelItems.length > 0 || cartDraft
                ? getCartPanelDescription(panelStage)
                : "Generated items will appear here after Sidekick creates a cart."}
            </p>
          </div>

          <div className="cart-preview-list">
            {cartPanelItems.length ? (
              cartPanelItems.map((item) => (
                <div key={item.id}>
                  <span>{item.product_title}</span>
                  <small>
                    x {formatQuantity(item.quantity)} | {item.pack_size}
                  </small>
                  <strong>Rs.{formatPrice(item.price)}</strong>
                </div>
              ))
            ) : (
              <div className="empty-cart-state">Cart preview is empty.</div>
            )}
          </div>

          <div className="cart-panel-actions">
            <button type="button" disabled={!canPreviewSidekickCart} onClick={handlePreviewSidekickCart}>
              Preview Sidekick Cart
            </button>
            <button type="button" disabled={!canAddToAmazonCart || isLoading} onClick={() => void handleAddToAmazonCart()}>
              Add to Amazon Cart
            </button>
            <button
              type="button"
              disabled={sidekickCartItems.length === 0 || isLoading}
              onClick={() => void handleEmptySidekickCart()}
            >
              <Trash2 size={16} />
              Empty Sidekick Cart
            </button>
          </div>
        </aside>

        {scheduleModalOpen ? (
          <aside className="schedule-drawer" aria-label="Schedule order settings">
            <div className="schedule-drawer-header">
              <div>
                <span>Schedule order</span>
                <h3>Choose when it runs</h3>
              </div>
              <button type="button" aria-label="Close schedule settings" onClick={() => setScheduleModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="schedule-mode-toggle" aria-label="Schedule type">
              <button
                className={scheduleDraft.kind === "once" ? "active" : ""}
                type="button"
                onClick={() => setScheduleDraft((draft) => ({ ...draft, kind: "once" }))}
              >
                Specific time
              </button>
              <button
                className={scheduleDraft.kind === "recurring" ? "active" : ""}
                type="button"
                onClick={() => setScheduleDraft((draft) => ({ ...draft, kind: "recurring" }))}
              >
                Repeating
              </button>
            </div>

            {scheduleDraft.kind === "once" ? (
              <div className="schedule-fields">
                <label>
                  Date
                  <input
                    type="date"
                    value={scheduleDraft.date}
                    min={getTodayInputDate()}
                    onChange={(event) =>
                      setScheduleDraft((draft) => ({
                        ...draft,
                        date: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  Time
                  <input
                    type="time"
                    value={scheduleDraft.time}
                    onChange={(event) =>
                      setScheduleDraft((draft) => ({
                        ...draft,
                        time: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>
            ) : (
              <div className="schedule-fields">
                <div>
                  <span className="schedule-field-label">Days</span>
                  <div className="schedule-day-grid">
                    {SCHEDULE_DAYS.map((day) => (
                      <button
                        className={scheduleDraft.days.includes(day.id) ? "active" : ""}
                        type="button"
                        key={day.id}
                        onClick={() =>
                          setScheduleDraft((draft) => ({
                            ...draft,
                            days: toggleScheduleDay(draft.days, day.id),
                          }))
                        }
                      >
                        {day.shortLabel}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  className="weekday-shortcut"
                  type="button"
                  onClick={() =>
                    setScheduleDraft((draft) => ({
                      ...draft,
                      days: WEEKDAY_IDS,
                      time: "08:00",
                    }))
                  }
                >
                  Monday to Friday at 8:00 AM
                </button>
                <label>
                  Time
                  <input
                    type="time"
                    value={scheduleDraft.time}
                    onChange={(event) =>
                      setScheduleDraft((draft) => ({
                        ...draft,
                        time: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>
            )}

            <div className="schedule-email">
              <label>
                <input
                  type="checkbox"
                  checked={scheduleDraft.emailReminderEnabled}
                  onChange={(event) =>
                    setScheduleDraft((draft) => ({
                      ...draft,
                      emailReminderEnabled: event.target.checked,
                    }))
                  }
                />
                Email reminder
              </label>
              {scheduleDraft.emailReminderEnabled ? (
                <input
                  aria-label="Reminder email"
                  type="email"
                  value={scheduleDraft.reminderEmail}
                  onChange={(event) =>
                    setScheduleDraft((draft) => ({
                      ...draft,
                      reminderEmail: event.target.value,
                    }))
                  }
                  placeholder="you@example.com"
                />
              ) : null}
            </div>

            <div className="schedule-summary">
              <span>Next run</span>
              <strong>{getScheduleDraftSummary(scheduleDraft)}</strong>
            </div>

            <div className="schedule-actions">
              <button type="button" onClick={() => setScheduleModalOpen(false)}>
                Done
              </button>
              <button type="button" onClick={handleCancelScheduleMode}>
                Cancel schedule
              </button>
            </div>
          </aside>
        ) : null}

        {previewMode ? (
          <aside className="cart-review-drawer" aria-label={previewMode === "mini" ? "Preview Mini Cart" : "Preview Sidekick Cart"}>
            <div className="cart-review-header">
              <div>
                <span>{previewMode === "mini" ? "Mini Cart" : "Sidekick Cart"}</span>
                <h3>{previewTitle}</h3>
                <p>Total Rs.{formatPrice(previewSubtotal)}</p>
              </div>
              <button type="button" aria-label="Close cart preview" onClick={() => setPreviewMode(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="cart-review-list">
              {previewItems.length ? (
                previewItems.map((item) => (
                  <div className="cart-review-item" key={item.id}>
                    <span>{item.product_title}</span>
                    <small>
                      {toTitleCase(item.requirement_name)} | x {formatQuantity(item.quantity)} | {item.pack_size}
                    </small>
                    <strong>Rs.{formatPrice(item.price)}</strong>
                    <div className="cart-review-controls">
                      <button
                        type="button"
                        aria-label={`Reduce ${item.product_title}`}
                        onClick={() => void handleQuantityChange(item, item.quantity - 1)}
                        disabled={isLoading || item.quantity <= 1}
                      >
                        <Minus size={15} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Increase ${item.product_title}`}
                        onClick={() => void handleQuantityChange(item, item.quantity + 1)}
                        disabled={isLoading}
                      >
                        <Plus size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCartItem({ source: previewMode, item })}
                        disabled={isLoading}
                      >
                        Change
                      </button>
                      <button type="button" onClick={() => void handleRemoveItem(item)} disabled={isLoading}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-chat-list">This cart has no items.</p>
              )}
            </div>

            <div className="cart-review-actions">
              {previewMode === "mini" ? (
                <button
                  type="button"
                  onClick={() => void handleAddToSidekickCart()}
                  disabled={!cartDraft || isLatestMiniCartAdded || isLoading}
                >
                  {isLatestMiniCartAdded ? "Added to Sidekick Cart" : "Add to Sidekick Cart"}
                </button>
              ) : (
                <button type="button" onClick={() => void handleAddToAmazonCart()} disabled={!canAddToAmazonCart || isLoading}>
                  Add to Amazon Cart
                </button>
              )}
              <button type="button" onClick={() => void handleEmptySidekickCart()} disabled={isLoading || sidekickCartItems.length === 0}>
                Empty Sidekick Cart
              </button>
            </div>
          </aside>
        ) : null}

        {selectedCartItem ? (
          <aside className="brand-drawer" aria-label={`Choose ${selectedCartItem.item.requirement_name} product`}>
            <div>
              <h3>Change {toTitleCase(selectedCartItem.item.requirement_name)}</h3>
              <button type="button" aria-label="Close product drawer" onClick={() => setSelectedCartItem(null)}>
                <X size={18} />
              </button>
            </div>
            <button type="button" onClick={() => setSelectedCartItem(null)}>
              {selectedCartItem.item.product_title} - Rs.{formatPrice(selectedCartItem.item.price)}
            </button>
            {selectedCartItem.item.alternatives.length > 0 ? (
              selectedCartItem.item.alternatives.map((alternative) => (
                <button
                  type="button"
                  key={alternative.id}
                  onClick={() => void handleReplaceItem(selectedCartItem, alternative)}
                  disabled={isLoading}
                >
                  {alternative.title} - Rs.{formatPrice(alternative.price)}
                </button>
              ))
            ) : (
              <p className="empty-chat-list">No alternative products found yet.</p>
            )}
          </aside>
        ) : null}
      </div>
    </div>
  );
}

type BuiltSchedulePayload =
  | {
      ok: true;
      scheduleType: ScheduleKind;
      runAt: string | null;
      recurrenceDays: string[];
      recurrenceTime: string | null;
      timezone: string;
      nextRunAt: string;
      reminderEmail: string | null;
      emailReminderEnabled: boolean;
      summary: string;
    }
  | {
      ok: false;
      error: string;
    };

function createDefaultScheduleDraft(): ScheduleDraft {
  return {
    kind: "once",
    date: getTomorrowInputDate(),
    time: "08:00",
    days: WEEKDAY_IDS,
    emailReminderEnabled: true,
    reminderEmail: DEFAULT_REMINDER_EMAIL,
  };
}

function buildSchedulePayload(draft: ScheduleDraft, requestText: string): BuiltSchedulePayload {
  const timezone = getLocalTimezone();
  const reminderEmail = draft.reminderEmail.trim();

  if (!requestText.trim()) {
    return { ok: false, error: "Type what Sidekick should order on this schedule." };
  }

  if (draft.emailReminderEnabled && !isValidEmail(reminderEmail)) {
    return { ok: false, error: "Enter a valid reminder email." };
  }

  if (draft.kind === "once") {
    const runAtDate = parseLocalDateTime(draft.date, draft.time);

    if (!runAtDate) {
      return { ok: false, error: "Choose a date and time for this order." };
    }

    if (runAtDate.getTime() <= Date.now()) {
      return { ok: false, error: "Choose a future date and time." };
    }

    return {
      ok: true,
      scheduleType: "once",
      runAt: runAtDate.toISOString(),
      recurrenceDays: [],
      recurrenceTime: null,
      timezone,
      nextRunAt: runAtDate.toISOString(),
      reminderEmail: draft.emailReminderEnabled ? reminderEmail : null,
      emailReminderEnabled: draft.emailReminderEnabled,
      summary: formatDateTimeLabel(runAtDate),
    };
  }

  if (draft.days.length === 0) {
    return { ok: false, error: "Choose at least one repeat day." };
  }

  const nextRunAt = getNextRecurringRun(draft.days, draft.time);

  if (!nextRunAt) {
    return { ok: false, error: "Choose a repeat time." };
  }

  return {
    ok: true,
    scheduleType: "recurring",
    runAt: null,
    recurrenceDays: sortScheduleDays(draft.days),
    recurrenceTime: normalizeScheduleTime(draft.time),
    timezone,
    nextRunAt: nextRunAt.toISOString(),
    reminderEmail: draft.emailReminderEnabled ? reminderEmail : null,
    emailReminderEnabled: draft.emailReminderEnabled,
    summary: `${formatDaySelection(draft.days)} at ${formatTimeLabel(draft.time)}`,
  };
}

function getScheduleDraftSummary(draft: ScheduleDraft) {
  if (draft.kind === "once") {
    const runAtDate = parseLocalDateTime(draft.date, draft.time);
    return runAtDate ? formatDateTimeLabel(runAtDate) : "Choose date and time";
  }

  if (draft.days.length === 0) {
    return "Choose repeat days";
  }

  return `${formatDaySelection(draft.days)} at ${formatTimeLabel(draft.time)}`;
}

function getTodayInputDate() {
  return formatDateInputValue(new Date());
}

function getTomorrowInputDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDateInputValue(tomorrow);
}

function formatDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDateTime(date: string, time: string) {
  if (!date || !time) {
    return null;
  }

  const parsed = new Date(`${date}T${normalizeScheduleTime(time)}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeScheduleTime(time: string) {
  if (!time) {
    return "";
  }

  return time.length === 5 ? `${time}:00` : time;
}

function getNextRecurringRun(days: string[], time: string) {
  const [hoursText, minutesText] = time.split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null;
  }

  const dayIndexes = new Set(
    days
      .map((dayId) => SCHEDULE_DAYS.find((day) => day.id === dayId)?.dayIndex)
      .filter((dayIndex): dayIndex is number => dayIndex !== undefined),
  );
  const now = new Date();

  for (let offset = 0; offset <= 14; offset += 1) {
    const candidate = new Date(now);
    candidate.setDate(now.getDate() + offset);
    candidate.setHours(hours, minutes, 0, 0);

    if (dayIndexes.has(candidate.getDay()) && candidate.getTime() > now.getTime()) {
      return candidate;
    }
  }

  return null;
}

function toggleScheduleDay(days: string[], dayId: string) {
  const nextDays = days.includes(dayId) ? days.filter((day) => day !== dayId) : [...days, dayId];
  return sortScheduleDays(nextDays);
}

function sortScheduleDays(days: string[]) {
  return SCHEDULE_DAYS.map((day) => day.id).filter((dayId) => days.includes(dayId));
}

function formatDaySelection(days: string[]) {
  const sortedDays = sortScheduleDays(days);

  if (arraysEqual(sortedDays, WEEKDAY_IDS)) {
    return "Monday to Friday";
  }

  if (sortedDays.length === SCHEDULE_DAYS.length) {
    return "Every day";
  }

  return sortedDays
    .map((dayId) => SCHEDULE_DAYS.find((day) => day.id === dayId)?.label)
    .filter(Boolean)
    .join(", ");
}

function arraysEqual(first: string[], second: string[]) {
  return first.length === second.length && first.every((value, index) => value === second[index]);
}

function formatTimeLabel(time: string) {
  const [hoursText, minutesText] = time.split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return "choose time";
  }

  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function formatDateTimeLabel(date: Date) {
  return date.toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getLocalTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function createOptimisticUserMessage(sessionId: string | null, content: string): SidekickChatMessage {
  return {
    id: `optimistic-${Date.now()}`,
    session_id: sessionId ?? "pending",
    role: "user",
    content,
    metadata: {},
    created_at: new Date().toISOString(),
  };
}

function getLoadedCartStage(cartDraft: SidekickCartDraft | null): CartStage {
  if (!cartDraft) {
    return "empty";
  }

  if (cartDraft.status === "committed") {
    return "amazon";
  }

  return "sidekick";
}

function isMiniCartItem(item: SidekickCartItem | SidekickSessionCartItem): item is SidekickCartItem {
  return "cart_draft_id" in item;
}

function isSidekickSessionCartItem(
  item: SidekickCartItem | SidekickSessionCartItem,
): item is SidekickSessionCartItem {
  return "session_id" in item && "source_cart_draft_ids" in item;
}

function sumPrices(items: Array<{ price: number }>) {
  return items.reduce((total, item) => total + Number(item.price ?? 0), 0);
}

function getCartPanelTitle(stage: CartStage) {
  if (stage === "mini") {
    return "Mini Cart";
  }

  if (stage === "sidekick") {
    return "Sidekick Cart";
  }

  if (stage === "amazon") {
    return "Amazon Cart";
  }

  return "Smart Cart";
}

function getCartPanelDescription(stage: CartStage) {
  if (stage === "mini") {
    return "Generated from the latest Sidekick response. Add it to Sidekick Cart when it looks right.";
  }

  if (stage === "sidekick") {
    return "Ready for review before it moves to Amazon Cart.";
  }

  if (stage === "amazon") {
    return "Added to the simulated Amazon Cart for checkout.";
  }

  return "Generated items will appear here after Sidekick creates a cart.";
}

function findModeFromStoredValue(value: string | null) {
  if (!value) {
    return null;
  }

  const normalizedValue = value.toLowerCase();

  return (
    sidekickModes.find((mode) => mode.name.toLowerCase() === normalizedValue) ??
    sidekickModes.find((mode) => mode.name.toLowerCase().includes(normalizedValue)) ??
    null
  );
}

function getSpeechRecognitionConstructor() {
  const speechWindow = window as SpeechRecognitionWindow;
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

function getTranscriptFromSpeechResults(results: BrowserSpeechRecognitionResultList) {
  const transcriptParts: string[] = [];

  for (let index = 0; index < results.length; index += 1) {
    const transcript = results[index]?.[0]?.transcript?.trim();
    if (transcript) {
      transcriptParts.push(transcript);
    }
  }

  return transcriptParts.join(" ").replace(/\s+/g, " ").trim();
}

function getVoiceErrorMessage(error?: string) {
  if (error === "not-allowed" || error === "service-not-allowed") {
    return "Microphone is blocked. Allow mic access for this site in Brave, then try again.";
  }

  if (error === "no-speech") {
    return "No speech detected. Try again and speak after the listening state appears.";
  }

  if (error === "network") {
    return "Voice recognition could not connect. Check Brave network permissions or try Chrome.";
  }

  if (error === "audio-capture") {
    return "No microphone was found. Check your input device and try again.";
  }

  return "Voice input stopped. Try again.";
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Image could not be read."));
    };
    reader.onerror = () => reject(new Error("Image could not be read."));
    reader.readAsDataURL(file);
  });
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Sidekick could not complete this request.";
}

function formatPrice(value: number) {
  return Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
}

function formatQuantity(value: number) {
  return Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

function mapCartItemToProductCard(item: SidekickCartItem) {
  return {
    item: toTitleCase(item.requirement_name),
    name: item.product_title,
    price: item.price,
    reason: item.reason,
    image: item.image_url ?? "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=320&q=80",
  };
}

function toTitleCase(value: string) {
  return value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}
