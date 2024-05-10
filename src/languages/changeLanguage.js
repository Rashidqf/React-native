import I18n from 'react-native-i18n';

//import constants
import {COMMON_DATA} from '@constants';

import {english} from './index';

// Change Language as pr localization language or set as a default selected language for localize strings
export const changeLanguage = params => {
  I18n.fallbacks = true;

  I18n.translations = {
    en: english,
  };

  if (params == COMMON_DATA.ENGLISH_LANG) {
    I18n.locale = 'en';
  } else {
  }
};
