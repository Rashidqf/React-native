import { Platform } from 'react-native';

// Define the COMMON_DATA object with the necessary types
export const COMMON_DATA = {
  ENGLISH_LANG: 'english' as const,
  DEVICE_TYPE: Platform.OS.toUpperCase() as 'IOS' | 'ANDROID' | 'WEB',
  PAGGING_COUNT: 10,

  // Terms & privacy link
  PRIVACY_LINK: 'https://sortapp.mobileapphero.com/privacy-policy',
  TERMS_LINK: 'https://sortapp.mobileapphero.com/terms-and-conditions',
};
