import { motion } from "framer-motion";
import React from "react";

const GamePiece = ({ piece, onClick, style = {} }) => {
  const player = piece.playerId;
  const colors = {
    1: '#E53E3E', // Red
    2: '#3182CE', // Blue
    3: '#38A169', // Green
    4: '#D69E2E'  // Yellow
  };

  const pieceColor = colors[player] || '#E53E3E';

  return (
    <motion.div
      className={`w-10 h-10 rounded-full shadow-piece cursor-pointer border-3 border-white relative overflow-hidden ${
        piece.canMove ? 'ring-3 ring-warning ring-opacity-80 animate-glow-pulse' : ''
      }`}
style={{
        backgroundColor: pieceColor,
        ...style
      }}
      onClick={() => onClick && onClick()}
      whileHover={{ 
        scale: 1.25, 
        boxShadow: `0 8px 25px ${pieceColor}60`,
        y: -2
      }}
      whileTap={{ scale: 0.85 }}
      animate={{
        scale: piece.canMove ? [1, 1.15, 1] : 1,
        boxShadow: piece.canMove 
          ? [`0 4px 15px ${pieceColor}60`, `0 8px 25px ${pieceColor}80`, `0 4px 15px ${pieceColor}60`]
          : `0 4px 15px ${pieceColor}40`
      }}
      transition={{
        scale: { duration: 1.2, repeat: piece.canMove ? Infinity : 0 },
        boxShadow: { duration: 1.2, repeat: piece.canMove ? Infinity : 0 }
      }}
      layout
>
      {/* Piece gradient background */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: `linear-gradient(135deg, ${pieceColor}, ${pieceColor}DD)`
        }}
      />
      
      {/* Inner shine */}
      <motion.div
        className="absolute inset-1 rounded-full bg-white bg-opacity-30"
        animate={{
          opacity: piece.canMove ? [0.3, 0.6, 0.3] : 0.3
        }}
        transition={{ duration: 1.2, repeat: piece.canMove ? Infinity : 0 }}
      />
      
      {/* Player number */}
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm drop-shadow-md">
        {player}
      </div>

      {/* Outer glow for active pieces */}
      {piece.canMove && (
        <motion.div
          className="absolute -inset-1 rounded-full opacity-60"
          style={{
            background: `radial-gradient(circle, ${pieceColor}80, transparent)`
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}
  );
};

export default GamePiece;