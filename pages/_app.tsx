// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css';
// used for code syntax highlighting
import 'prismjs/themes/prism-tomorrow.css';
// used for rendering equations
import 'katex/dist/katex.min.css';
import '../styles/globals.css';
import '../styles/tailwind.css';

import 'firebase/compat/auth';

import CloudBackgroundImage from '@/public/assets/cloud-bg.png';
import PondBackgroundImage from '@/public/assets/pond-background.png';
import RegisterBackgroundImage from '@/public/assets/registration-background.png';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AppProps } from 'next/dist/shared/lib/router/router';
import Head from 'next/head';
import Image from 'next/image';
import { initFirebase } from '../lib/firebase-client';
import { FCMProvider } from '../lib/service-worker/FCMContext';
import { AuthProvider } from '../lib/user/AuthContext';

import AppHeader2_Wrapper from '@/components/AppHeader2/wrapper';
import AppNavbarBottom from '@/components/AppNavbarBottom/AppNavbarBottom';
import { NavbarCallbackRegistryContext } from '@/lib/context/navbar';
import { SectionReferenceContext } from '@/lib/context/section';
import { useUrlHash } from '@/lib/hooks';
import { loadSlim } from '@tsparticles/slim';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { initParticlesEngine } from '../components/Particles';
import { ParticlesContext } from '../components/Particles/ParticlesProvider';

initFirebase();

/**
 * A Wrapper for the HackPortal web app.
 *
 * This is the root of the component heirarchy. When the site is hydrated, this
 * will load into memory and never re-initialize unless the page refreshes.
 */
function PortalApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [particlesInit, setParticlesInit] = useState(false);
  const hash = useUrlHash('');

  const duckBackgroundPathnames = ['/profile', '/profile/application/edit'];
  const registerBackgroundPathnames = ['/register', '/auth'];
  const cloudBackgroundPathnames = ['/admin', '/admin/scan', '/admin/users', '/admin/waitlist'];

  const faqRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const scheduleRef = useRef<HTMLDivElement | null>(null);

  const [callbackRegistry, setCallbackRegistry] = useState<Record<string, () => Promise<unknown>>>(
    {},
  );

  useEffect(() => {
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash]);

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size

      //await loadAll(engine);
      //await loadFull(engine);
      //await loadBasic(engine);

      await loadSlim(engine);
    })
      .then(() => {
        setParticlesInit(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    // <DndProvider backend={HTML5Backend}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AuthProvider>
        <FCMProvider>
          <ParticlesContext.Provider
            value={{ state: { init: particlesInit }, actions: { setInit: setParticlesInit } }}
          >
            <SectionReferenceContext.Provider
              value={{
                faqRef,
                aboutRef,
                scheduleRef,
              }}
            >
              <NavbarCallbackRegistryContext.Provider
                value={{
                  callbackRegistry,
                  setCallback: (pathname, cb) => {
                    setCallbackRegistry((prev) => ({ ...prev, [pathname]: cb }));
                  },
                  removeCallback: (pathname) => {
                    setCallbackRegistry((prev) => {
                      if (!Object.hasOwn(prev, pathname)) {
                        return prev;
                      }
                      const newRegistry = { ...prev };
                      delete newRegistry[pathname];
                      return newRegistry;
                    });
                  },
                }}
              >
                <Head>
                  <meta charSet="utf-8" />
                  <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                  <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
                  />
                  <title>HackUTD 2024</title> {/* !change */}
                  <meta name="description" content="Your all-in-one guide to this hackathon." />
                  {process.env.ENABLE_PWA ||
                    (process.env.NODE_ENV !== 'development' && (
                      <link rel="manifest" href="/manifest.json" />
                    ))}
                  <link href="/icons/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16" />
                  <link href="/icons/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32" />
                  <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
                  <meta name="theme-color" content="#5D5FEF" />
                </Head>

                <div className="min-h-screen flex flex-col overflow-hidden">
                  {duckBackgroundPathnames.includes(router.pathname) && (
                    <div className="fixed top-0 left-0 w-screen h-screen -z-10">
                      <Image
                        className="w-screen h-screen object-cover"
                        alt="Pond Background"
                        src={PondBackgroundImage.src}
                        width={PondBackgroundImage.width}
                        height={PondBackgroundImage.height}
                      />
                    </div>
                  )}

                  {registerBackgroundPathnames.includes(router.pathname) && (
                    <div className="fixed top-0 left-0 w-screen h-screen -z-10">
                      <Image
                        className="w-screen h-screen object-cover"
                        alt="Register background"
                        src={RegisterBackgroundImage.src}
                        width={RegisterBackgroundImage.width}
                        height={RegisterBackgroundImage.height}
                      />
                    </div>
                  )}

                  {cloudBackgroundPathnames.includes(router.pathname) && (
                    <div className="fixed top-0 left-0 w-screen h-screen -z-10">
                      <Image
                        className="w-screen h-screen object-cover"
                        alt="Cloud background"
                        src={CloudBackgroundImage.src}
                        width={CloudBackgroundImage.width}
                        height={CloudBackgroundImage.height}
                      />
                    </div>
                  )}

                  <AppHeader2_Wrapper />

                  {/* Spacer at the top of the page so that content won't be covered by the navbar */}
                  {router.pathname !== '/' && <div className="h-[86px] shrink-0" />}

                  <Component {...pageProps} />

                  {/* Spacer at the bottom of the page for navbar bottom on mobile, so that content won't be covered by the navbar */}
                  <div className="md:hidden h-[80px] shrink-0" />

                  <AppNavbarBottom />
                </div>
              </NavbarCallbackRegistryContext.Provider>
            </SectionReferenceContext.Provider>
          </ParticlesContext.Provider>
        </FCMProvider>
      </AuthProvider>
    </LocalizationProvider>
    // </DndProvider>
  );
}

export default PortalApp;
