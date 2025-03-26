import React from 'react';
import { motion } from 'framer-motion';

const LeafIdea = ({ label, delay = 0, onClick }) => {
  const pathVariants = {
    initial: { d: 'M50 0 L0 100 L100 100 Z' }, // Forme en V
    animate: { d: 'M0 0 H100 V100 H0 Z' },     // Rectangle horizontal
  };

  const textVariants = {
    initial: {
      opacity: 0,
      scale: 0.5,
      y: 20,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
  };

  return (
    <motion.svg
      width="200"
      height="100"
      viewBox="0 0 100 100"
      style={{ cursor: 'pointer', margin: '10px 0' }}
      onClick={onClick}
    >
      <defs>
        <clipPath id={`clip-${label}`}>
          <motion.path
            variants={pathVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay }}
          />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${label})`}>
        <motion.path
          variants={pathVariants}
          fill="#D3D3D3"
          stroke="black"
          strokeWidth="1"
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay }}
        />
        <motion.text
          variants={textVariants}
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="16"
          fill="#000"
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay }}
        >
          {label}
        </motion.text>
      </g>
    </motion.svg>
  );
};

export default LeafIdea;
