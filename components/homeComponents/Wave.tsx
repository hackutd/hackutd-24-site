import React from 'react';
import oceanBorder from '../../public/assets/ocean-border.png';

const Wave = () => {
  return (
    <img 
      src={oceanBorder.src} 
      alt="Ocean Wave" 
      style={{
        width: '100%',
        height: 'auto',
        display: 'block',
        margin: '0', 
        paddingBottom: '0', 
      }}
    />
  );
};

export default Wave;
