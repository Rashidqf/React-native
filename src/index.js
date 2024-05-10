import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';

//import third-party packages
import { Provider } from 'react-redux';
import createStore from '@reducers';

// import constants
import { ASYNC_KEYS, COMMON_DATA } from '@constants';

// import components
import { ToastAlert, LoadingIndicator, AlertModel } from '@components';

// import themes
import { COLORS } from '@themes';

//import languages
import { changeLanguage } from '@languages';

//import navigator
import { AppContainer } from '@navigator';

// import storage functions
import { StorageOperation } from '@storage';
import AppContextProvider from './themes/AppContextProvider';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './reducers';

// create our store
// const store = createStore();

export default class App extends React.Component {
  constructor() {
    super();

    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;

    if (TextInput.defaultProps == null) TextInput.defaultProps = {};
    TextInput.defaultProps.allowFontScaling = false;
  }

  componentDidMount() {
    //setting language when app is opened
    StorageOperation.getData([ASYNC_KEYS.LANGUAGE]).then(response => {
      if (response[0][1] != null) {
        changeLanguage(response[0][1]);
      } else {
        changeLanguage(COMMON_DATA.ENGLISH_LANG);
      }
    });
  }

  render() {
    console.disableYellowBox = true;

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppContextProvider>
            <View style={styles.container}>
              <SafeAreaProvider>
                <AppContainer />
              </SafeAreaProvider>
            </View>
            <LoadingIndicator />
            <AlertModel />
            <ToastAlert />
          </AppContextProvider>
        </PersistGate>
      </Provider>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
});
