import { createContext, MutableRefObject } from 'react';

interface SectionReferenceContextValueType {
  faqRef: MutableRefObject<HTMLElement> | null;
  aboutRef: MutableRefObject<HTMLDivElement> | null;
}

export const SectionReferenceContext = createContext<SectionReferenceContextValueType>({
  faqRef: null,
  aboutRef: null,
});
