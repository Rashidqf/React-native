import I18n from 'react-native-i18n';

// import constants
import {english} from './index';
import {COMMON_DATA} from '../components';
// Define a type for the changeLanguage parameters
type ChangeLanguageParams = string;

// Change Language as per localization language or set as a default selected language for localize strings
export const changeLanguage = (params: ChangeLanguageParams): void => {
  I18n.fallbacks = true;

  I18n.translations = {
    en: english,
  };

  if (params === COMMON_DATA.ENGLISH_LANG) {
    I18n.locale = 'en';
  } else {
    // Handle other languages if needed
  }
};
