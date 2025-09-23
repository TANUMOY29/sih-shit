// This service manages fetching translations from the Google Translate API and caching them.
const API_KEY = process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY;
const API_URL = `https://translation.googleapis.com/language/translate/v2`;

// Cache to store fetched translations and avoid repeated API calls
const cache = {};

export const translateText = async (text, targetLanguage) => {
    // English is the source, no need to translate
    if (targetLanguage === 'en') {
        return text;
    }

    const cacheKey = `${targetLanguage}:${text}`;
    // If we have already translated this text, return the cached version
    if (cache[cacheKey]) {
        return cache[cacheKey];
    }

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                target: targetLanguage,
                format: 'text',
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to translate text.');
        }

        const data = await response.json();
        const translatedText = data.data.translations[0].translatedText;

        // Save the new translation to our cache
        cache[cacheKey] = translatedText;
        return translatedText;

    } catch (error) {
        console.error("Translation error:", error);
        return text; // Fallback to the original text if translation fails
    }
};
