import React from 'react';
import oceanBorder from '../../public/assets/ocean-border.png';
import Image from 'next/image';

const Wave = () => {
  return (
    <Image
      src={oceanBorder.src}
      alt="Ocean Wave"
      width={0}
      height={0}
      sizes="100vh"
      style={{
        height: 'auto',
        display: 'block',
        margin: '0',
        paddingBottom: '0',
      }}
    />
  );
};

export default Wave;
