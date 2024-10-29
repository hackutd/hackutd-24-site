import { useState } from 'react';
import styles from './index.module.css';
import HackUTDTitle from '../../public/assets/HackUTD 2024 Title.png';
import Image from 'next/image';

export default function ParkingPage() {
  return (
    <section
      className={`bg-[url('/assets/hero.png')] md:bg-[url('/assets/hero-desktop.png')] lg:bg-[url('/assets/hero-xl.png')] ${styles.container} min-h-screen bg-center relative bg-white flex flex-col-reverse md:flex-col`}
      style={{
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100vh',
        minHeight: '100vh',
      }}
    >
      <div className="h-full w-full relative">
        <div className="absolute top-[40%] mx-auto w-full text-center">
          <h1 className="text-6xl font-poppins font-bold text-white md:w-[700px] mx-auto">
            Sorry, parking passes will be coming soon!
          </h1>
        </div>
      </div>
    </section>
  );
}
