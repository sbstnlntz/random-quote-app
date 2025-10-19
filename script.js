const STORAGE_KEYS = {
  favorites: "random-quote-app:favorites",
  theme: "random-quote-app:theme",
  dailyQuote: "random-quote-app:dailyQuote",
  language: "random-quote-app:language",
};

const API_CONFIG = {
  endpoint: "https://api.zitat-service.de/v1/quote",
  fetchAttempts: 6,
  requestPauseMs: 120,
};

const FALLBACK_QUOTES_URL = "fallback-quotes.json";
const INLINE_FALLBACK_QUOTES = [
  {
    text: "Vertraue dir selbst, dann weißt du, wie du leben sollst.",
    author: "Johann Wolfgang von Goethe",
    tags: ["Selbstvertrauen", "Weisheit"],
    language: "DE",
  },
  {
    text: "Dream big, start small, act now.",
    author: "Unknown",
    tags: ["Vision"],
    language: "EN",
  },
];

const state = {
  quotes: [],
  currentQuote: null,
  currentDailyQuote: null,
  favorites: [],
  seenQuoteIds: new Set(),
  currentLanguage: "de",
  fallbackQuotes: null,
};

const elements = {
  quoteText: document.getElementById("quoteText"),
  quoteAuthor: document.getElementById("quoteAuthor"),
  quoteTags: document.getElementById("quoteTags"),
  dailyQuoteText: document.getElementById("dailyQuoteText"),
  dailyQuoteAuthor: document.getElementById("dailyQuoteAuthor"),
  dailyQuoteTags: document.getElementById("dailyQuoteTags"),
  newQuoteBtn: document.getElementById("newQuoteBtn"),
  favoriteBtn: document.getElementById("favoriteBtn"),
  languageToggle: document.getElementById("languageToggle"),
  actionFeedback: document.getElementById("actionFeedback"),
  liveQuoteCard: document.querySelector(".live-quote"),
  darkModeToggle: document.getElementById("darkModeToggle"),
  favoritesPanel: document.getElementById("favoritesPanel"),
  favoritesList: document.getElementById("favoritesList"),
  favoritesEmpty: document.getElementById("favoritesEmpty"),
  openFavorites: document.getElementById("openFavorites"),
  closeFavorites: document.getElementById("closeFavorites"),
};

const SUPPORTED_LANGUAGES = ["de", "en"];

const LANGUAGE_FLAGS = {
  de: "🇩🇪",
  en: "🇬🇧",
};

const TRANSLATIONS = {
  de: {
    languageNames: { de: "Deutsch", en: "Englisch" },
    language: {
      toggleLabel: "Sprache {{flag}} {{language}}",
    },
    app: {
      title: "Random Quote App",
    },
    daily: {
      heading: "Zitat des Tages",
      subtitle: "Bestimmt durch das heutige Datum",
    },
    random: {
      heading: "Zufallszitat",
      subtitle: "Entdecke neue Gedanken und speichere Favoriten",
    },
    buttons: {
      newQuote: "Neues Zitat",
      openFavorites: "Favoriten",
      closeFavorites: "Favoriten schliessen",
      removeFavorite: "Loeschen",
    },
    favorites: {
      heading: "Favoriten",
      hint: "Gespeicherte Zitate bleiben dank LocalStorage auch nach dem Schliessen erhalten.",
      empty: "Keine Favoriten gespeichert.",
      menuLabel: "Favoriten anzeigen",
      languageLabel: "Sprache {{flag}}",
      unknownAuthor: "Unbekannt",
      authorUnknownTag: "Autor unbekannt",
      openLink: "Auf zitat-service.de oeffnen",
    },
    footer: {
      shortcuts: "Tastaturkuerzel: <kbd>N</kbd> neues Zitat - <kbd>F</kbd> favorisieren",
      dataSource:
        'Zitate bereitgestellt von <a href="https://www.zitat-service.de" target="_blank" rel="noopener">zitat-service.de</a>',
    },
    noscript: {
      message: "Bitte JavaScript aktivieren, um die Random Quote App nutzen zu koennen.",
    },
    messages: {
      appInitFailed: "Die App konnte nicht gestartet werden.",
      dailyQuoteUnavailable: "Keine Zitate verfuegbar.",
      newQuoteLoaded: "Neues Zitat geladen.",
      fallbackQuoteShown: "Fallback-Zitat angezeigt (Service nicht verfuegbar).",
      quoteLoadFailed: "Zitat konnte nicht geladen werden.",
      favoriteRemoved: "Zitat aus Favoriten entfernt.",
      favoriteAdded: "Zitat zu Favoriten hinzugefuegt.",
      favoritesPersistFailed: "Favoriten konnten nicht gespeichert werden.",
      favoritesDelete: "Favorit entfernt.",
      languageChanged: "Sprache geaendert auf {{language}}.",
      languageQuotesFailed: "Zitate konnten nach Sprachwechsel nicht geladen werden.",
    },
    favoriteButton: {
      default: "Zitat favorisieren",
      remove: "Favorit entfernen",
    },
    theme: {
      toggle: "Dark Mode umschalten",
    },
  },
  en: {
    languageNames: { de: "German", en: "English" },
    language: {
      toggleLabel: "Language {{flag}} {{language}}",
    },
    app: {
      title: "Random Quote App",
    },
    daily: {
      heading: "Quote of the Day",
      subtitle: "Determined by today's date",
    },
    random: {
      heading: "Random Quote",
      subtitle: "Discover new thoughts and save favorites",
    },
    buttons: {
      newQuote: "New Quote",
      openFavorites: "Favorites",
      closeFavorites: "Close favorites",
      removeFavorite: "Remove",
    },
    favorites: {
      heading: "Favorites",
      hint: "Saved quotes stay available thanks to LocalStorage.",
      empty: "No favorites saved.",
      menuLabel: "Open favorites",
      languageLabel: "Language {{flag}}",
      unknownAuthor: "Unknown",
      authorUnknownTag: "Author unknown",
      openLink: "Open on zitat-service.de",
    },
    footer: {
      shortcuts: "Shortcuts: <kbd>N</kbd> new quote - <kbd>F</kbd> favorite",
      dataSource:
        'Quotes provided by <a href="https://www.zitat-service.de" target="_blank" rel="noopener">zitat-service.de</a>',
    },
    noscript: {
      message: "Please enable JavaScript to use the Random Quote App.",
    },
    messages: {
      appInitFailed: "The app could not be started.",
      dailyQuoteUnavailable: "No quotes available.",
      newQuoteLoaded: "New quote loaded.",
      fallbackQuoteShown: "Fallback quote shown (service unavailable).",
      quoteLoadFailed: "Quote could not be loaded.",
      favoriteRemoved: "Quote removed from favorites.",
      favoriteAdded: "Quote saved to favorites.",
      favoritesPersistFailed: "Favorites could not be saved.",
      favoritesDelete: "Favorite removed.",
      languageChanged: "Language switched to {{language}}.",
      languageQuotesFailed: "Quotes could not be loaded after switching languages.",
    },
    favoriteButton: {
      default: "Save quote",
      remove: "Remove favorite",
    },
    theme: {
      toggle: "Toggle dark mode",
    },
  },
};

const uiElements = {
  appTitle: document.getElementById("appTitle"),
  dailyHeading: document.getElementById("dailyQuoteHeading"),
  dailySubtitle: document.querySelector('[data-i18n="daily.subtitle"]'),
  randomHeading: document.getElementById("controlsHeading"),
  randomSubtitle: document.querySelector('[data-i18n="random.subtitle"]'),
  newQuoteButton: document.getElementById("newQuoteBtn"),
  openFavorites: document.getElementById("openFavorites"),
  favoritesHeading: document.getElementById("favoritesHeading"),
  favoritesHint: document.querySelector(".favorites-hint"),
  favoritesEmpty: document.getElementById("favoritesEmpty"),
  favoritesClose: document.getElementById("closeFavorites"),
  footerShortcuts: document.querySelector('[data-i18n="footer.shortcuts"]'),
  footerDataSource: document.querySelector('[data-i18n="footer.dataSource"]'),
  noscriptMessage: document.querySelector('[data-i18n="noscript.message"]'),
};

function resolveTranslation(language, segments) {
  let current = TRANSLATIONS[language];
  for (const key of segments) {
    if (!current || typeof current !== "object" || !(key in current)) {
      return undefined;
    }
    current = current[key];
  }
  return current;
}

function translate(path, replacements = {}, language = state.currentLanguage) {
  const segments = path.split(".");
  let value = resolveTranslation(language, segments);
  if (value === undefined) {
    value = resolveTranslation("de", segments);
  }
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(/\{\{(\w+)\}\}/g, (_, token) =>
    Object.prototype.hasOwnProperty.call(replacements, token) ? String(replacements[token]) : "",
  );
}

function getLanguageName(language, dictionaryLanguage = state.currentLanguage) {
  return translate(`languageNames.${language}`, {}, dictionaryLanguage) || language.toUpperCase();
}

function getLanguageFlag(language) {
  if (!language) {
    return "";
  }
  return LANGUAGE_FLAGS[language.toLowerCase()] || "";
}

function updateLanguageToggleUi(language = state.currentLanguage) {
  if (!elements.languageToggle) {
    return;
  }
  const normalized = SUPPORTED_LANGUAGES.includes(language) ? language : "de";
  elements.languageToggle.dataset.language = normalized;
  elements.languageToggle.setAttribute("aria-pressed", normalized === "en" ? "true" : "false");
  const label = translate(
    "language.toggleLabel",
    { language: getLanguageName(normalized, normalized), flag: getLanguageFlag(normalized) },
    normalized,
  );
  elements.languageToggle.setAttribute("aria-label", label);
  elements.languageToggle.title = label;
}

function updateDarkModeToggleUi(isDark) {
  if (!elements.darkModeToggle) {
    return;
  }
  elements.darkModeToggle.setAttribute("aria-pressed", String(isDark));
  const label = translate("theme.toggle");
  elements.darkModeToggle.setAttribute("aria-label", label);
  elements.darkModeToggle.title = label;
  elements.darkModeToggle.textContent = isDark ? "🌙" : "☀️";
}

function applyTranslations() {
  document.documentElement.setAttribute("lang", state.currentLanguage);

  if (uiElements.appTitle) {
    uiElements.appTitle.textContent = translate("app.title");
  }
  if (uiElements.dailyHeading) {
    uiElements.dailyHeading.textContent = translate("daily.heading");
  }
  if (uiElements.dailySubtitle) {
    uiElements.dailySubtitle.textContent = translate("daily.subtitle");
  }
  if (uiElements.randomHeading) {
    uiElements.randomHeading.textContent = translate("random.heading");
  }
  if (uiElements.randomSubtitle) {
    uiElements.randomSubtitle.textContent = translate("random.subtitle");
  }
  if (uiElements.newQuoteButton) {
    uiElements.newQuoteButton.textContent = translate("buttons.newQuote");
  }
  if (uiElements.openFavorites) {
    uiElements.openFavorites.textContent = translate("buttons.openFavorites");
    uiElements.openFavorites.setAttribute("aria-label", translate("favorites.menuLabel"));
  }
  if (uiElements.favoritesHeading) {
    uiElements.favoritesHeading.textContent = translate("favorites.heading");
  }
  if (uiElements.favoritesHint) {
    uiElements.favoritesHint.textContent = translate("favorites.hint");
  }
  if (uiElements.favoritesEmpty) {
    uiElements.favoritesEmpty.textContent = translate("favorites.empty");
  }
  if (uiElements.favoritesClose) {
    uiElements.favoritesClose.setAttribute("aria-label", translate("buttons.closeFavorites"));
  }
  if (uiElements.footerShortcuts) {
    uiElements.footerShortcuts.innerHTML = translate("footer.shortcuts");
  }
  if (uiElements.footerDataSource) {
    uiElements.footerDataSource.innerHTML = translate("footer.dataSource");
  }
  if (uiElements.noscriptMessage) {
    uiElements.noscriptMessage.textContent = translate("noscript.message");
  }

  updateLanguageToggleUi();
  updateDarkModeToggleUi(document.body.classList.contains("dark"));
  if (state.currentQuote && elements.quoteTags) {
    elements.quoteTags.textContent = formatTags(state.currentQuote.tags);
  }
  if (state.currentDailyQuote && elements.dailyQuoteTags) {
    elements.dailyQuoteTags.textContent = formatTags(state.currentDailyQuote.tags);
  }
  updateFavoriteButtonState();
  renderFavoritesList();
}
init().catch((error) => {
  console.error("Initialisierung fehlgeschlagen:", error);
  setActionFeedback(translate("messages.appInitFailed"), true);
});

async function init() {
  loadFavoritesFromStorage();
  loadLanguagePreference();
  applyTranslations();
  applySavedTheme();
  bindEventListeners();
  await loadDailyQuote();
  await fetchAndDisplayNewQuote(false);
  clearActionFeedback();
}

function bindEventListeners() {
  if (elements.newQuoteBtn) {
    elements.newQuoteBtn.addEventListener("click", () => fetchAndDisplayNewQuote(true));
  }
  if (elements.favoriteBtn) {
    elements.favoriteBtn.addEventListener("click", toggleFavorite);
  }
  if (elements.languageToggle) {
    elements.languageToggle.addEventListener("click", handleLanguageToggle);
  }
  if (elements.darkModeToggle) {
    elements.darkModeToggle.addEventListener("click", toggleDarkMode);
  }
  if (elements.openFavorites) {
    elements.openFavorites.addEventListener("click", () => setFavoritesPanel(true));
  }
  if (elements.closeFavorites) {
    elements.closeFavorites.addEventListener("click", () => setFavoritesPanel(false));
  }

  document.addEventListener("keydown", handleKeyboardShortcuts);

  if (elements.favoritesPanel) {
    elements.favoritesPanel.addEventListener("click", (event) => {
      if (event.target.matches(".remove-favorite")) {
        const id = event.target.getAttribute("data-id");
        removeFavorite(id);
      }
    });
  }

  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEYS.favorites) {
      loadFavoritesFromStorage();
      renderFavoritesList();
      updateFavoriteButtonState();
    }
    if (event.key === STORAGE_KEYS.theme) {
      applySavedTheme();
    }
  });
}

function handleLanguageToggle() {
  const nextLanguage = state.currentLanguage === "de" ? "en" : "de";
  changeLanguage(nextLanguage);
}

async function loadDailyQuote() {
  const today = getTodayKey();
  const language = state.currentLanguage;
  const stored = readStoredDailyQuote(language);
  if (stored && stored.date === today && stored.quote) {
    displayDailyQuote(stored.quote);
    addQuoteToCollection(stored.quote);
    return;
  }

  try {
    const quote = await getQuote({ language });
    displayDailyQuote(quote);
    addQuoteToCollection(quote);
    persistDailyQuote(language, { date: today, language, quote });
  } catch (error) {
    console.warn("Tageszitat konnte nicht geladen werden:", error);
    const fallback = await getFallbackQuote({ language, allowDuplicates: false });
    if (fallback) {
      displayDailyQuote(fallback);
      addQuoteToCollection(fallback);
      persistDailyQuote(language, { date: today, language, quote: fallback });
    } else {
      elements.dailyQuoteText.textContent = translate("messages.dailyQuoteUnavailable");
      elements.dailyQuoteAuthor.textContent = "";
      elements.dailyQuoteTags.textContent = "";
    }
  }
}

async function fetchAndDisplayNewQuote(animate = true) {
  setButtonLoading(elements.newQuoteBtn, true);
  try {
    const quote = await getQuote();
    addQuoteToCollection(quote);
    displayQuote(quote, animate);
    setActionFeedback(translate("messages.newQuoteLoaded"));
  } catch (error) {
    console.error("Neues Zitat konnte nicht geladen werden:", error);
    const fallback = await getFallbackQuote({ allowDuplicates: false });
    if (fallback) {
      addQuoteToCollection(fallback);
      displayQuote(fallback, animate);
      setActionFeedback(translate("messages.fallbackQuoteShown"), true);
    } else {
      setActionFeedback(translate("messages.quoteLoadFailed"), true);
    }
  } finally {
    setButtonLoading(elements.newQuoteBtn, false);
  }
}

async function getQuote({ language, allowDuplicates = false } = {}) {
  let lastError = null;
  const targetLanguage = (language || state.currentLanguage || "de").toLowerCase();

  for (let attempt = 0; attempt < API_CONFIG.fetchAttempts; attempt += 1) {
    try {
      const quote = await fetchQuoteFromApi(targetLanguage);
      if (!allowDuplicates) {
        const id = createQuoteId(quote);
        if (state.seenQuoteIds.has(id)) {
          continue;
        }
      }
      return quote;
    } catch (error) {
      lastError = error;
      console.warn("API-Abruf fehlgeschlagen:", error);
    }

    if (API_CONFIG.requestPauseMs > 0) {
      await wait(API_CONFIG.requestPauseMs);
    }
  }

  if (lastError) {
    throw lastError;
  }
  throw new Error("No quotes available.");
}

async function fetchQuoteFromApi(language) {
  const params = [];
  if (language) {
    params.push(`language=${encodeURIComponent(language)}`);
  }
  const url = params.length > 0 ? `${API_CONFIG.endpoint}?${params.join("&")}` : API_CONFIG.endpoint;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const payload = await response.json();
  const normalized = normalizeApiQuote(payload);
  if (!normalized) {
    throw new Error("Ungültige Antwort vom Service erhalten.");
  }
  return normalized;
}

async function getFallbackQuote({ language, allowDuplicates = true } = {}) {
  const quotes = await loadFallbackQuotes();
  if (!Array.isArray(quotes) || quotes.length === 0) {
    return null;
  }

  const targetLanguage = (language || state.currentLanguage || "de").toUpperCase();
  const filtered = quotes.filter(
    (quote) => quote.language.toUpperCase() === targetLanguage || quote.language.toUpperCase() === "MIX",
  );
  const pool = filtered.length > 0 ? filtered : quotes;

  let candidates = pool;
  if (!allowDuplicates) {
    candidates = pool.filter((quote) => !state.seenQuoteIds.has(createQuoteId(quote)));
  }
  if (candidates.length === 0) {
    candidates = pool;
  }
  const index = Math.floor(Math.random() * candidates.length);
  const selected = candidates[index] || pool[0];
  if (!selected) {
    return null;
  }
  return {
    ...selected,
    tags: Array.isArray(selected.tags) ? [...selected.tags] : [],
  };
}

async function loadFallbackQuotes() {
  if (Array.isArray(state.fallbackQuotes)) {
    return state.fallbackQuotes;
  }
  try {
    const response = await fetch(FALLBACK_QUOTES_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("fallback-quotes.json liefert kein Array.");
    }
    state.fallbackQuotes = data.map((quote) =>
      buildQuoteRecord({
        text: quote.text,
        author: quote.author,
        tags: Array.isArray(quote.tags) ? quote.tags : [],
        language: quote.language || "MIX",
        source: quote.source || "",
        link: quote.link || "",
        authorLink: quote.authorLink || "",
      }),
    );
  } catch (error) {
    console.warn("Fallback-Datei konnte nicht geladen werden:", error);
    state.fallbackQuotes = INLINE_FALLBACK_QUOTES.map((quote) =>
      buildQuoteRecord({
        text: quote.text,
        author: quote.author,
        tags: Array.isArray(quote.tags) ? quote.tags : [],
        language: quote.language || "MIX",
        source: quote.source || "",
        link: quote.link || "",
        authorLink: quote.authorLink || "",
      }),
    );
  }
  return state.fallbackQuotes;
}

function buildQuoteRecord(raw, { forceUnknownAuthor = false } = {}) {
  const textContent = typeof raw.text === "string" ? raw.text.trim() : "";
  const trimmedAuthor = typeof raw.author === "string" && raw.author.trim().length > 0 ? raw.author.trim() : null;
  const languageCode = (raw.language || state.currentLanguage || "MIX").toString().toUpperCase();
  const tags = Array.isArray(raw.tags)
    ? raw.tags
        .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
        .filter((tag) => Boolean(tag))
    : [];
  if (!tags.some((tag) => typeof tag === "string" && tag.startsWith("__LANGUAGE__="))) {
    tags.push(`__LANGUAGE__=${languageCode}`);
  }
  if ((forceUnknownAuthor || !trimmedAuthor) && !tags.includes("__AUTHOR_UNKNOWN__")) {
    tags.push("__AUTHOR_UNKNOWN__");
  }
  return {
    text: textContent,
    author: trimmedAuthor,
    tags,
    language: languageCode,
    source: typeof raw.source === "string" ? raw.source : "",
    link: typeof raw.link === "string" ? raw.link : "",
    authorLink: typeof raw.authorLink === "string" ? raw.authorLink : "",
  };
}

function normalizeStoredFavorite(record) {
  if (!record || typeof record !== "object") {
    return record;
  }
  const normalized = { ...record };
  const languageCode = (normalized.language || "MIX").toString().toUpperCase();
  const author =
    typeof normalized.author === "string" && normalized.author.trim().length > 0 ? normalized.author.trim() : null;
  const tags = Array.isArray(normalized.tags)
    ? normalized.tags
        .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
        .filter((tag) => Boolean(tag))
    : [];
  const upgradedTags = [];
  tags.forEach((tag) => {
    if (tag.startsWith("__LANGUAGE__=") || tag === "__AUTHOR_UNKNOWN__") {
      if (!upgradedTags.includes(tag)) {
        upgradedTags.push(tag);
      }
      return;
    }
    if (/^Sprache[: ]/i.test(tag)) {
      const match = tag.match(/([A-Z]{2})$/i);
      if (match) {
        const code = match[1].toUpperCase();
        const token = `__LANGUAGE__=${code}`;
        if (!upgradedTags.includes(token)) {
          upgradedTags.push(token);
        }
        return;
      }
    }
    if (/^(Autor unbekannt|Author unknown)$/i.test(tag)) {
      if (!upgradedTags.includes("__AUTHOR_UNKNOWN__")) {
        upgradedTags.push("__AUTHOR_UNKNOWN__");
      }
      return;
    }
    upgradedTags.push(tag);
  });
  if (!upgradedTags.some((tag) => tag.startsWith("__LANGUAGE__="))) {
    upgradedTags.push(`__LANGUAGE__=${languageCode}`);
  }
  if ((!author || /^(Unbekannt|Unknown)$/i.test(author)) && !upgradedTags.includes("__AUTHOR_UNKNOWN__")) {
    upgradedTags.push("__AUTHOR_UNKNOWN__");
  }
  normalized.author = author && !/^(Unbekannt|Unknown)$/i.test(author) ? author : null;
  normalized.language = languageCode;
  normalized.tags = upgradedTags;
  return normalized;
}

function normalizeApiQuote(payload) {
  const text = payload?.quote?.trim();
  if (!text) {
    return null;
  }
  const payloadTags = Array.isArray(payload.tags)
    ? payload.tags
    : Array.isArray(payload.quoteTags)
    ? payload.quoteTags
    : [];
  return buildQuoteRecord(
    {
      text,
      author: payload.authorName,
      tags: payloadTags,
      language: payload.language || state.currentLanguage || "MIX",
      source: payload.source?.trim() || "",
      link: payload.link || "",
      authorLink: payload.authorLink || "",
    },
    { forceUnknownAuthor: payload.authorId === 0 },
  );
}

function addQuoteToCollection(quote) {
  const id = createQuoteId(quote);
  if (state.seenQuoteIds.has(id)) {
    return false;
  }
  state.seenQuoteIds.add(id);
  state.quotes.push(quote);
  return true;
}

function displayQuote(quote, animate = true) {
  state.currentQuote = quote;
  elements.quoteText.textContent = quote.text;
  elements.quoteAuthor.textContent = quote.author ? `— ${quote.author}` : "";
  elements.quoteTags.textContent = formatTags(quote.tags);
  updateFavoriteButtonState();
  if (animate) {
    triggerCardAnimation();
  }
}

function displayDailyQuote(quote) {
  state.currentDailyQuote = quote;
  elements.dailyQuoteText.textContent = quote.text;
  elements.dailyQuoteAuthor.textContent = quote.author ? `- ${quote.author}` : "";
  elements.dailyQuoteTags.textContent = formatTags(quote.tags);
}

function triggerCardAnimation() {
  if (!elements.liveQuoteCard) {
    return;
  }
  elements.liveQuoteCard.classList.remove("animate");
  void elements.liveQuoteCard.offsetWidth;
  elements.liveQuoteCard.classList.add("animate");
}

function formatTags(tags) {
  if (!Array.isArray(tags) || tags.length === 0) {
    return "";
  }
  const formatted = [];
  tags.forEach((tag) => {
    if (typeof tag !== "string") {
      return;
    }
    const trimmed = tag.trim();
    if (!trimmed) {
      return;
    }
    if (trimmed.startsWith("__LANGUAGE__=")) {
      const code = trimmed.split("=").pop() || "";
      const flag = getLanguageFlag(code);
      formatted.push(`#${flag || code.toUpperCase()}`);
    } else if (trimmed === "__AUTHOR_UNKNOWN__") {
      formatted.push(`#${translate("favorites.authorUnknownTag")}`);
    } else {
      formatted.push(`#${trimmed}`);
    }
  });
  return formatted.join(" ");
}

function toggleFavorite() {
  if (!state.currentQuote) {
    return;
  }
  const id = createQuoteId(state.currentQuote);
  const index = state.favorites.findIndex((favorite) => createQuoteId(favorite) === id);
  if (index >= 0) {
    state.favorites.splice(index, 1);
    setActionFeedback(translate("messages.favoriteRemoved"));
  } else {
    state.favorites.push({ ...state.currentQuote, tags: [...(state.currentQuote.tags || [])] });
    setActionFeedback(translate("messages.favoriteAdded"));
  }
  persistFavorites();
  renderFavoritesList();
  updateFavoriteButtonState();
}

function loadFavoritesFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.favorites);
    state.favorites = saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.warn("Favoriten konnten nicht geladen werden:", error);
    state.favorites = [];
  }
  state.favorites = state.favorites.map(normalizeStoredFavorite);
  renderFavoritesList();
}

function persistFavorites() {
  try {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(state.favorites));
  } catch (error) {
    console.warn("Favoriten konnten nicht gespeichert werden:", error);
    setActionFeedback(translate("messages.favoritesPersistFailed"), true);
  }
}

function renderFavoritesList() {
  elements.favoritesList.innerHTML = "";
  if (state.favorites.length === 0) {
    elements.favoritesEmpty.hidden = false;
    elements.favoritesEmpty.textContent = translate("favorites.empty");
    return;
  }
  elements.favoritesEmpty.hidden = true;

  state.favorites.forEach((favorite) => {
    const listItem = document.createElement("li");

    const quoteText = document.createElement("p");
    quoteText.textContent = favorite.text;
    quoteText.className = "favorite-text";

    const meta = document.createElement("div");
    meta.className = "favorites-meta";

    const author = document.createElement("span");
    author.textContent = favorite.author || translate("favorites.unknownAuthor");
    meta.append(author);

  if (favorite.language) {
    const language = document.createElement("span");
    const flag = getLanguageFlag(favorite.language);
    language.textContent = translate("favorites.languageLabel", {
      flag: flag || favorite.language.toUpperCase(),
      code: favorite.language.toUpperCase(),
    });
    meta.append(language);
  }

    if (Array.isArray(favorite.tags) && favorite.tags.length > 0) {
      const tags = document.createElement("span");
      tags.textContent = formatTags(favorite.tags);
      tags.className = "favorite-tags";
      meta.append(tags);
    }

    const extra = document.createElement("div");
    extra.className = "favorites-extra";

    if (favorite.source) {
      const source = document.createElement("span");
      source.textContent = favorite.source;
      extra.append(source);
    }

    if (favorite.link) {
      const link = document.createElement("a");
      link.href = favorite.link;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = translate("favorites.openLink");
      extra.append(link);
    }

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-favorite secondary-button";
    const removeLabel = translate("buttons.removeFavorite");
    removeButton.textContent = removeLabel;
    removeButton.setAttribute("aria-label", removeLabel);
    removeButton.setAttribute("data-id", createQuoteId(favorite));

    listItem.append(quoteText, meta);
    if (extra.childNodes.length > 0) {
      listItem.append(extra);
    }
    listItem.append(removeButton);
    elements.favoritesList.append(listItem);
  });
}

function removeFavorite(id) {
  const index = state.favorites.findIndex((favorite) => createQuoteId(favorite) === id);
  if (index >= 0) {
    state.favorites.splice(index, 1);
    persistFavorites();
    renderFavoritesList();
    updateFavoriteButtonState();
    setActionFeedback(translate("messages.favoritesDelete"));
  }
}

function updateFavoriteButtonState() {
  const button = elements.favoriteBtn;
  if (!button) {
    return;
  }
  const defaultLabel = translate("favoriteButton.default");
  if (!state.currentQuote) {
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", defaultLabel);
    button.title = defaultLabel;
    button.textContent = "";
    return;
  }
  const isFavorite = state.favorites.some((favorite) => isSameQuote(favorite, state.currentQuote));
  const label = isFavorite ? translate("favoriteButton.remove") : defaultLabel;
  button.setAttribute("aria-pressed", String(isFavorite));
  button.setAttribute("aria-label", label);
  button.title = label;
  button.textContent = "";
}

function setFavoritesPanel(open) {
  const isOpen = Boolean(open);
  elements.favoritesPanel.dataset.open = String(isOpen);
  elements.openFavorites.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) {
    elements.favoritesPanel.hidden = false;
    elements.closeFavorites.focus();
  } else {
    elements.favoritesPanel.hidden = true;
    elements.openFavorites.focus();
  }
}

function buildQuoteText(quote) {
  const author = quote.author ? ` — ${quote.author}` : "";
  const source = quote.source ? ` (${quote.source})` : "";
  return `${quote.text}${author}${source}`;
}

function handleKeyboardShortcuts(event) {
  if (event.defaultPrevented) {
    return;
  }
  const tagName = event.target?.tagName;
  if (tagName === "INPUT" || tagName === "TEXTAREA" || event.target?.isContentEditable) {
    return;
  }
  switch (event.key.toLowerCase()) {
    case "n":
      event.preventDefault();
      fetchAndDisplayNewQuote(true);
      break;
    case "f":
      event.preventDefault();
      elements.favoriteBtn.click();
      break;
    default:
      break;
  }
}

function toggleDarkMode() {
  const willBeDark = !document.body.classList.contains("dark");
  document.body.classList.toggle("dark", willBeDark);
  updateDarkModeToggleUi(willBeDark);
  try {
    localStorage.setItem(STORAGE_KEYS.theme, willBeDark ? "dark" : "light");
  } catch (error) {
    console.warn("Theme konnte nicht gespeichert werden:", error);
  }
}

function applySavedTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEYS.theme);
  } catch (error) {
    console.warn("Theme aus LocalStorage nicht lesbar:", error);
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const enableDark = saved ? saved === "dark" : prefersDark;
  document.body.classList.toggle("dark", enableDark);
  updateDarkModeToggleUi(enableDark);
}

function setActionFeedback(message, isError = false) {
  elements.actionFeedback.textContent = message;
  elements.actionFeedback.style.color = isError ? "#ef4444" : "var(--accent-color)";
  if (message) {
    clearTimeout(setActionFeedback.timeout);
    setActionFeedback.timeout = setTimeout(() => {
      clearActionFeedback();
    }, 4000);
  }
}

function clearActionFeedback() {
  elements.actionFeedback.textContent = "";
}

function isSameQuote(a, b) {
  return Boolean(a && b && a.text === b.text && a.author === b.author);
}

function createQuoteId(quote) {
  return `${quote.text}__${quote.author || "unknown"}`;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function setButtonLoading(button, isLoading) {
  if (!button) {
    return;
  }
  button.disabled = isLoading;
  button.setAttribute("aria-busy", String(isLoading));
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function readStoredDailyQuote(language) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.dailyQuote);
    if (!raw) {
      return null;
    }
    const stored = JSON.parse(raw);
    if (stored && typeof stored === "object" && !Array.isArray(stored)) {
      if (stored.quotes && typeof stored.quotes === "object") {
        return stored.quotes[language] || null;
      }
      if (stored.language) {
        return stored.language === language ? stored : null;
      }
      return language === "de" ? stored : null;
    }
    return null;
  } catch (error) {
    console.warn("Tageszitat aus LocalStorage konnte nicht gelesen werden:", error);
    return null;
  }
}

function persistDailyQuote(language, record) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.dailyQuote);
    let aggregated = {};
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        if (parsed.quotes && typeof parsed.quotes === "object") {
          aggregated = parsed.quotes;
        } else if (parsed.language) {
          aggregated[parsed.language] = parsed;
        } else {
          aggregated.de = parsed;
        }
      }
    }
    aggregated[language] = { ...record, language };
    localStorage.setItem(STORAGE_KEYS.dailyQuote, JSON.stringify({ quotes: aggregated }));
  } catch (error) {
    console.warn("Tageszitat konnte nicht gespeichert werden:", error);
  }
}

function changeLanguage(language, { showFeedback = true } = {}) {
  const normalized = typeof language === "string" ? language.toLowerCase() : "";
  if (!SUPPORTED_LANGUAGES.includes(normalized)) {
    updateLanguageToggleUi(state.currentLanguage);
    return;
  }
  if (normalized === state.currentLanguage) {
    updateLanguageToggleUi(normalized);
    applyTranslations();
    return;
  }
  state.currentLanguage = normalized;
  persistLanguagePreference(normalized);
  state.seenQuoteIds.clear();
  state.quotes.length = 0;
  applyTranslations();
  if (showFeedback) {
    setActionFeedback(translate("messages.languageChanged", { language: getLanguageName(normalized) }));
  }
  loadDailyQuote()
    .then(() => fetchAndDisplayNewQuote(false))
    .catch((error) => {
      console.error("Fehler nach Sprachwechsel:", error);
      setActionFeedback(translate("messages.languageQuotesFailed"), true);
    });
}

function loadLanguagePreference() {
  let saved = "de";
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.language);
    if (stored && SUPPORTED_LANGUAGES.includes(stored.toLowerCase())) {
      saved = stored.toLowerCase();
    }
  } catch (error) {
    console.warn("Sprachpraeferenz konnte nicht gelesen werden:", error);
  }
  state.currentLanguage = saved;
  updateLanguageToggleUi(saved);
}

function persistLanguagePreference(language) {
  try {
    localStorage.setItem(STORAGE_KEYS.language, language);
  } catch (error) {
    console.warn("Sprachpraeferenz konnte nicht gespeichert werden:", error);
  }
}
