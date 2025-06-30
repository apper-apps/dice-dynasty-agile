import { motion } from "framer-motion";
import React, { useState } from "react";

const Dice = ({ value = 1, isRolling = false, onClick, disabled = false, size = 'lg' }) => {
  const [isPressed, setIsPressed] = useState(false);

  const sizes = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl', 
    lg: 'w-20 h-20 text-3xl',
    xl: 'w-24 h-24 text-4xl'
  };

const getDiceFace = (num) => {
    const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return faces[num - 1] || '⚀';
  };

  return (
    <motion.div
      className={`${sizes[size]} bg-white rounded-xl shadow-ludo-lg flex items-center justify-center cursor-pointer select-none relative overflow-hidden border-2 border-gray-300 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl hover:border-warning'
      }`}
      onClick={!disabled ? onClick : undefined}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      animate={{
        rotateX: isRolling ? [0, 360, 720] : 0,
        rotateY: isRolling ? [0, 180, 360] : 0,
        scale: isPressed ? 0.95 : 1,
      }}
      transition={{
        duration: isRolling ? 0.8 : 0.1,
        ease: isRolling ? "easeOut" : "easeInOut"
      }}
      whileHover={!disabled ? { 
        scale: 1.05,
        boxShadow: "0 10px 30px rgba(245, 158, 11, 0.4)"
      } : {}}
      style={{ 
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
>
      {/* Dice face */}
      <motion.div
        className="text-gray-900 font-bold"
        animate={{
          opacity: isRolling ? [1, 0.3, 1] : 1,
          scale: isRolling ? [1, 0.8, 1] : 1
        }}
        transition={{ duration: 0.8 }}
      >
        {getDiceFace(value)}
      </motion.div>

{/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-30 rounded-xl"
        animate={{
          opacity: isPressed ? 0.1 : 0.3,
          scale: isPressed ? 0.9 : 1
        }}
      />
{/* Rolling indicator */}
      {isRolling && (
        <motion.div
          className="absolute inset-0 border-4 border-warning border-t-transparent rounded-xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, ease: "linear" }}
        />
      )}

      {/* Click ripple effect */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-white rounded-xl"
          initial={{ opacity: 0.3, scale: 0 }}
          animate={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

export default Dice;