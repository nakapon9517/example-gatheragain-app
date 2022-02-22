import { useContext } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';
import { Storage, StorageName } from '@/utils';
import AppContext from '@/contexts/AppContext';

export const useTheme = () => {
  const defaultTheme = useColorScheme() as NonNullable<ColorSchemeName>;
  const { theme, setTheme } = useContext(AppContext);
  const { userInfo } = useContext(AppContext);
  const storage = new Storage<ColorSchemeName>();

  const saveTheme = (theme: 'light' | 'dark' | undefined) => {
    if (theme) {
      storage.save(StorageName.THEME, theme);
    } else {
      storage.delete(StorageName.THEME);
    }
    setTheme(theme);
  };

  return {
    theme: userInfo?.isDefaultTheme ? defaultTheme : theme ?? defaultTheme,
    saveTheme,
  };
};
