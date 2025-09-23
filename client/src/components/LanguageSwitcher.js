import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from '../context/TranslationContext'; // <-- use your custom hook

const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'as', name: 'অসমীয়া' },
];

export default function LanguageSwitcher() {
    const { language, setLanguage } = useTranslation(); // from your custom provider

    const changeLanguage = (lng) => {
        setLanguage(lng); // updates context, translation API will be used
    };

    return (
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {languages.find((lang) => lang.code === language)?.name || 'Language'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {languages.map((lang) => (
                    <Dropdown.Item 
                        key={lang.code} 
                        onClick={() => changeLanguage(lang.code)}
                        active={lang.code === language} // highlight current lang
                    >
                        {lang.name}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}
