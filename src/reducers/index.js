// Wherever you build your reducers
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import rootReducer from './rootReducer';
//Import the actions types constant we defined in our actions

const middleware = [thunk];
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['redState'],
};

let store;

const persistedReducer = persistReducer(persistConfig, rootReducer);

store = createStore(persistedReducer, compose(applyMiddleware(...middleware)));

export default store;
export const persistor = persistStore(store);
