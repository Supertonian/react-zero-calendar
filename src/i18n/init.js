import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ko, en } from './index';

const init = () => {
  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources: {
        en,
        ko,
      },
      lng: 'en',
      fallbackLng: 'en',

      interpolation: {
        escapeValue: false,
      },
    });
};

const changeLanguage = language => {
  i18n.changeLanguage(language);
};

export { init, changeLanguage };
