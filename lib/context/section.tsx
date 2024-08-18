import { createContext, MutableRefObject } from 'react';

interface SectionReferenceContextValueType {
  faqRef: MutableRefObject<HTMLElement> | null;
}

export const SectionReferenceContext = createContext<SectionReferenceContextValueType>({
  faqRef: null,
});
