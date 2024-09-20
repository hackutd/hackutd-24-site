import Image from 'next/image';
import DuckBackgroundImage from '@/public/assets/duck-background.png';
import RegisterBackgroundImage from '@/public/assets/registration-background.png';
import PondBackgroundImage from '@/public/assets/pond-background.png';
import Head from 'next/head';
import { AppProps } from 'next/dist/shared/lib/router/router';
import 'firebase/compat/auth';
import { initFirebase } from '../lib/firebase-client';
import { AuthProvider } from '../lib/user/AuthContext';
import '../styles/globals.css';
import '../styles/tailwind.css';
import { FCMProvider } from '../lib/service-worker/FCMContext';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';

// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css';
// used for code syntax highlighting
import 'prismjs/themes/prism-tomorrow.css';
// used for rendering equations
import 'katex/dist/katex.min.css';
import { useEffect, useRef, useState } from 'react';
import { initParticlesEngine } from '../components/Particles';
import { loadSlim } from '@tsparticles/slim';
import { ParticlesContext } from '../components/Particles/ParticlesProvider';
import AppHeader2_Wrapper from '@/components/AppHeader2/wrapper';
import AppNavbarBottom from '@/components/AppNavbarBottom/AppNavbarBottom';
import { useRouter } from 'next/router';
import { useUrlHash } from '@/lib/hooks';
import { SectionReferenceContext } from '@/lib/context/section';

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
  const duckBackgroundPathnames = ['/profile'];
  const registerBackgroundPathnames = ['/register', '/auth'];
  const faqRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const scheduleRef = useRef<HTMLDivElement | null>(null);

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

              <div className="min-h-screen flex flex-col">
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

                <AppHeader2_Wrapper />

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

                {/* Spacer at the top of the page so that content won't be covered by the navbar */}
                {router.pathname !== '/' && <div className="hidden md:block h-[86px] shrink-0" />}

                <Component {...pageProps} />

                {/* Spacer at the bottom of the page for navbar bottom on mobile, so that content won't be covered by the navbar */}
                <div className="md:hidden h-[80px] shrink-0" />

                <AppNavbarBottom />
              </div>
            </SectionReferenceContext.Provider>
          </ParticlesContext.Provider>
        </FCMProvider>
      </AuthProvider>
    </LocalizationProvider>
    // </DndProvider>
  );
}

export default PortalApp;
