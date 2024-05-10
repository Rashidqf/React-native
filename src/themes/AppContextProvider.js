import React, { useState, useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Light, Dark } from './colors';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../actions/reduxAction';

export const AppContext = React.createContext(null);

const AppContextProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { selectTheme } = useSelector(state => state?.redState);
  const [theme, changeTheme] = useState(Dark);

  useEffect(() => {
    changeTheme(selectTheme);
   dispatch(setTheme(selectTheme));
  }, []);

  return (
    <AppContext.Provider value={{ theme: theme, changeTheme }}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </AppContext.Provider>
  );
};

export default AppContextProvider;
