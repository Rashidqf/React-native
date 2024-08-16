import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import AppContextProvider from './theme/AppContextProvider';
import {COLORS} from './theme';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppContainer from './navigator/stackNavigator';
import {Provider} from 'react-redux';
import {store, persistor} from './store/store';
import {PersistGate} from 'redux-persist/integration/react';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContextProvider>
          <View style={styles.container}>
            <SafeAreaProvider>
              <AppContainer />
            </SafeAreaProvider>
          </View>
        </AppContextProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
});
