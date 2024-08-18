import { createContext, MutableRefObject } from 'react';

interface SectionReferenceContextValueType {
  faqRef: MutableRefObject<HTMLDivElement> | null;
  aboutRef: MutableRefObject<HTMLDivElement> | null;
  scheduleRef: MutableRefObject<HTMLDivElement> | null;
}

export const SectionReferenceContext = createContext<SectionReferenceContextValueType>({
  faqRef: null,
  aboutRef: null,
  scheduleRef: null,
});
