// translationService.js
import api from "./api"; // your axios/fetch wrapper

// In-memory cache
const memoryCache = {};

// Load cache from localStorage (if exists)
const storedCache = localStorage.getItem("translations");
if (storedCache) {
  Object.assign(memoryCache, JSON.parse(storedCache));
}

function saveToLocalStorage() {
  localStorage.setItem("translations", JSON.stringify(memoryCache));
}

/**
 * Get translation for a given key and language
 * @param {string} text - Text key to translate
 * @param {string} lang - Target language (e.g. "en", "bn")
 */
export async function translate(text, lang = "en") {
  if (!text) return "";

  // Check cache first
  if (memoryCache[lang] && memoryCache[lang][text]) {
    return memoryCache[lang][text];
  }

  try {
    // Call your backend API
    const res = await api.post("/translate", { text, targetLang: lang });
    const translated = res.data?.translatedText || text;

    // Save to cache
    if (!memoryCache[lang]) memoryCache[lang] = {};
    memoryCache[lang][text] = translated;
    saveToLocalStorage();

    return translated;
  } catch (err) {
    console.error("Translation error:", err);
    return text; // fallback
  }
}
