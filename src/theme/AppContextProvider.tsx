import React, {useState, useEffect, ReactNode} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {Light, Dark} from './color';
// import { useDispatch, useSelector } from 'react-redux';
// import { setTheme } from '../actions/reduxAction';

interface AppContextProps {
  theme: typeof Light | typeof Dark;
  changeTheme: (theme: typeof Light | typeof Dark) => void;
}

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContext = React.createContext<AppContextProps | null>(null);

const AppContextProvider: React.FC<AppContextProviderProps> = ({children}) => {
  // const dispatch = useDispatch();
  // const selectTheme = useSelector((state: any) => state?.redState?.selectTheme);
  const [theme, changeTheme] = useState<typeof Light | typeof Dark>(Dark);

  // useEffect(() => {
  //   changeTheme(selectTheme);
  //   dispatch(setTheme(selectTheme));
  // }, [selectTheme, dispatch]);

  return (
    <AppContext.Provider value={{theme, changeTheme}}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </AppContext.Provider>
  );
};

export default AppContextProvider;
