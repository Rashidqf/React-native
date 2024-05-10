import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageOperation = {
  // Store data into async storage
  setData: async function (obj) {
    return new Promise((resolve, reject) => {
      try {
        AsyncStorage.multiSet(obj).then(() => {
          resolve(true);
        });
      } catch (e) {
        resolve(false);
      }
    });
  },

  //Get Data from async Storge
  getData: async function (keys) {
    return new Promise((resolve, reject) => {
      try {
        AsyncStorage.multiGet(keys).then(value => {
          resolve(value);
        });
      } catch (e) {
        resolve(false);
      }
    });
  },

  // Remove Data from async Storage
  removeData: async function (keys) {
    return new Promise((resolve, reject) => {
      try {
        AsyncStorage.multiRemove(keys).then(() => {
          resolve(true);
        });
      } catch (e) {
        resolve(false);
      }
    });
  },
};
