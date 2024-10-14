'use client';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

export default function HomeChallengesCard(props: { challenge: Challenge; blockType: number }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / 20;
    const y = (clientY - (rect.top + rect.height / 2)) / 20;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      style={{
        transform: isHovering
          ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale3d(1, 1, 1)`
          : 'translate3d(0px, 0px, 0) scale3d(1, 1, 1)',
        transition: 'transform 0.1s ease-out',
      }}
      className="h-full w-full mx-auto bg-white rounded-lg mb-8 mt-8 relative"
    >
      <div className="w-4/5 md:w-full mx-auto">
        <div className="w-5/6 mx-auto">
          {/* Challenge Name */}
          <div className="flex justify-center">
            <h1 className="font-montserrat font-semibold text-xl mt-4 text-center border-b-2 border-[rgb(0,0,0,0.4)] w-fit">
              <span className="uppercase">presented by {props.challenge.organization}</span>
            </h1>
          </div>
          {/* Company Name */}
          <h1 className="font-atlasi font-normal text-2xl text-[#40B7BA] my-4 uppercase">
            {props.challenge.title}
          </h1>
          {/* Description */}
          <div className="mb-8 max-w-fit">
            <p className="text-md line-clamp-5 text-balance">{props.challenge.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
