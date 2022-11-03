import { createContext } from 'react';

interface ThemeCtx {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

const ThemeContext = createContext<ThemeCtx | null>(null);

export default ThemeContext;
