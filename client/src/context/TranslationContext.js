import React, { createContext, useState, useContext } from 'react';
import { translate as translateText } from '../services/translationService';

const TranslationContext = createContext();

export const useTranslation = () => {
    return useContext(TranslationContext);
};

export const TranslationProvider = ({ children }) => {
    const [language, setLanguage] = useState('en'); // Default language is English
    const [translations, setTranslations] = useState({});

    const translate = async (text) => {
        if (language === 'en') return text;
        const key = `${language}:${text}`;
        if (translations[key]) return translations[key];

        const translatedText = await translateText(text, language);
        setTranslations(prev => ({ ...prev, [key]: translatedText }));
        return translatedText;
    };

    const value = {
        language,
        setLanguage,
        translate,
    };

    return (
        <TranslationContext.Provider value={value}>
            {children}
        </TranslationContext.Provider>
    );
};
