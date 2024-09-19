'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useState } from 'react';

export default function HomeChallengeTrackCard(props: {
  challengeTrack: { title: string; subtitle: string; description: string; imgSrc: string };
  blockType: number;
}) {
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
      className="mx-auto bg-white rounded-lg w-[350px] m-8"
    >
      <div
        className={`mx-auto bg-gradient-to-b from-[#F5A3B6] from-10% to-[#F7CE79] rounded-t-md flex justify-center relative h-[220px]`}
      >
        <Image
          className="absolute -top-11 left-1/2 -rotate-12 -translate-x-1/2"
          src={props.challengeTrack.imgSrc}
          alt="Track Image"
          width={250}
          height={200}
        />
      </div>
      <div className="w-5/6 mx-auto">
        {/* Challenge Name */}
        <h1 className="font-nunito text-xl font-bold mt-4">
          {props.challengeTrack.title.toUpperCase()}
        </h1>
        {/* Challenge subtittle */}
        <h1 className="font-nunito text-lg font-bold my-4">{props.challengeTrack.subtitle}</h1>
        {/* Description */}
        <div className="mb-8 max-w-fit">
          <p className="text-md line-clamp-5 text-balance">{props.challengeTrack.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
