import I18n from 'react-native-i18n';
import { english } from './index';

// Define types for the localize parameters and return type
type LocalizeParams = { [key: string]: any };

export const localize = (key: string, params: LocalizeParams = {}): string => {
  I18n.fallbacks = true;

  I18n.translations = {
    en: english,
  };

  const currentLocale = I18n.currentLocale();

  return I18n.t(key, params);
};
