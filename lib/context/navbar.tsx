import { createContext } from 'react';

interface NavbarCallbackRegistryContextValue {
  callbackRegistry: Record<string, () => Promise<unknown>>;
  setCallback: (pathname: string, cb: () => Promise<unknown>) => void;
  removeCallback: (pathname: string) => void;
}

export const NavbarCallbackRegistryContext = createContext<NavbarCallbackRegistryContextValue>({
  callbackRegistry: {},
  setCallback: () => {},
  removeCallback: () => {},
});
