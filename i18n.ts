import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { default as en } from "@/i18n/en.json";
import { default as fr } from "@/i18n/fr.json";
import { default as pt } from "@/i18n/pt.json";

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  pt: { translation: pt },
};

const fallbackLng = "en"; // Default language

export const changeLanguage = async (language: string) => {
  try {
    await i18n.changeLanguage(language);
    await AsyncStorage.setItem("language", language); // Persist the selected language
  } catch (error) {
    console.error("Error changing language", error);
  }
};

// Function to load the stored language from AsyncStorage
const loadLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem("language");
    return savedLanguage || fallbackLng;
  } catch (error) {
    console.error("Error loading language from AsyncStorage", error);
  }
  return "en"; // Default language if nothing is saved
};

const initI18n = async () => {
  const language = await loadLanguage();

  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources,
      lng: language,
      fallbackLng,
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    });
};

// Initialize i18n
initI18n();

export default i18n;
