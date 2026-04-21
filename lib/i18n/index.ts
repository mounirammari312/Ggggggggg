import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ar } from './ar';
import { fr } from './fr';
import { en } from './en';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    ar: { translation: ar },
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: 'ar',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
export { i18n };
