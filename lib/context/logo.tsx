import { createContext } from 'react';

export default createContext({
  currentHoveredLogo: '',
  setCurrentHoveredLogo: (value: string) => {},
});
