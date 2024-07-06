import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useUrlHash = (initialValue: string) => {
  const router = useRouter();
  const [hash, setHash] = useState(initialValue);

  const updateHash = (str: string) => {
    if (!str) return;
    setHash(str.split('#')[1]);
  };

  useEffect(() => {
    // Init
    updateHash(router.asPath);

    const onNextJSHashChange = (url: string) => updateHash(url);
    router.events.on('hashChangeStart', onNextJSHashChange);

    return () => {
      router.events.off('hashChangeStart', onNextJSHashChange);
    };
  }, [router.asPath, router.events]);

  return hash;
};
