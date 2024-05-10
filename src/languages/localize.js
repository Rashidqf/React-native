import I18n from 'react-native-i18n';
import {english} from './index';

// Get Localize string of selected language
export const localize = (key, params = {}) => {
  I18n.fallbacks = true;

  I18n.translations = {
    en: english,
  };

  var currentLocal = I18n.currentLocale();

  return I18n.t(key, params);
};
