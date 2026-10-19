import { createContext, useContext } from "react";

export interface ColorModeContextValue {
  toggleColorMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextValue>({
  toggleColorMode: () => {},
});

export function useColorMode() {
  return useContext(ColorModeContext);
}
