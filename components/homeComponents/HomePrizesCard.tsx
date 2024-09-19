'use client';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface Prize {
  rank: number;
  prizeName: string;
}

interface HomePrizesCardProps {
  prize: Prize;
  blockType: number;
  sponsorTitle: string;
  challengeTitle: string;
}

export default function HomePrizesCard({
  prize,
  blockType,
  sponsorTitle,
  challengeTitle,
}: HomePrizesCardProps) {
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
      className="bg-white shadow-lg rounded-lg p-6 w-full max-w-[572px] h-auto flex flex-col justify-between"
    >
      <div className="text-center">
        {/* Sponsor Title from props */}
        <h2 className="text-sm font-montserrat text-gray-700 mb-2">
          PRESENTED BY {sponsorTitle.toUpperCase()}
        </h2>
        <hr className="border-t-2 border-gray-300 my-3" /> {/* Horizontal line */}
        {/* Challenge Title from props */}
        <h1 className="text-2xl font-bold text-[#27aae2] mb-4">{challengeTitle.toUpperCase()}</h1>
        {/* Prize List */}
        <ul className="list-disc list-inside text-left text-gray-700 mb-6 space-y-2">
          <li>
            {prize.rank} Place: {prize.prizeName}
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
