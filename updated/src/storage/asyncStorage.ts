import AsyncStorage from '@react-native-async-storage/async-storage';

interface StorageOperation {
  setData(obj: Array<[string, string]>): Promise<boolean>;
  getData(keys: string[]): Promise<Array<[string, string] | null>>;
  removeData(keys: string[]): Promise<boolean>;
  checkData(keys: string[]): Promise<boolean[]>;
}

export const StorageOperation: StorageOperation = {
  setData: async function (obj: Array<[string, string]>): Promise<boolean> {
    try {
      const filteredObj = obj.filter(
        ([key, value]) =>
          key !== null &&
          key !== undefined &&
          value !== null &&
          value !== undefined,
      );
      await AsyncStorage.multiSet(filteredObj);

      // Optional: Log the saved data for verification
      const savedData = await AsyncStorage.multiGet(
        filteredObj.map(([key]) => key),
      );
      console.log('Saved data:', savedData);

      return true;
    } catch (e) {
      console.error('Error setting data in AsyncStorage:', e);
      return false;
    }
  },

  getData: async function (
    keys: string[],
  ): Promise<Array<[string, string] | null>> {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      const result: Array<[string, string] | null> = pairs.map(pair =>
        pair[0] !== null && pair[1] !== null ? [pair[0], pair[1]] : null,
      );
      return result;
    } catch (e) {
      console.error('Error getting data from AsyncStorage:', e);
      return keys.map(() => null);
    }
  },

  removeData: async function (keys: string[]): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch (e) {
      console.error('Error removing data from AsyncStorage:', e);
      return false;
    }
  },

  checkData: async function (keys: string[]): Promise<boolean[]> {
    try {
      const data = await AsyncStorage.multiGet(keys);
      return keys.map(key => data.some(([k, v]) => k === key && v !== null));
    } catch (e) {
      console.error('Error checking data in AsyncStorage:', e);
      return keys.map(() => false);
    }
  },
};
