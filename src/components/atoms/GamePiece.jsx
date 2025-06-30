import { motion } from 'framer-motion';

const GamePiece = ({ piece, onClick, style = {} }) => {
  const player = piece.playerId;
  const colors = {
    1: '#6366F1',
    2: '#EC4899', 
    3: '#10B981',
    4: '#F59E0B'
  };

  const pieceColor = colors[player] || '#6366F1';

  return (
    <motion.div
      className={`w-8 h-8 rounded-full shadow-lg cursor-pointer border-2 border-white border-opacity-30 ${
        piece.canMove ? 'ring-2 ring-accent ring-opacity-70' : ''
      }`}
      style={{
        backgroundColor: pieceColor,
        ...style
      }}
      onClick={() => onClick && onClick()}
      whileHover={{ 
        scale: 1.2, 
        boxShadow: `0 8px 25px ${pieceColor}40` 
      }}
      whileTap={{ scale: 0.9 }}
      animate={{
        scale: piece.canMove ? [1, 1.1, 1] : 1,
        boxShadow: piece.canMove 
          ? [`0 4px 15px ${pieceColor}60`, `0 6px 20px ${pieceColor}80`, `0 4px 15px ${pieceColor}60`]
          : `0 4px 15px ${pieceColor}40`
      }}
      transition={{
        scale: { duration: 1, repeat: piece.canMove ? Infinity : 0 },
        boxShadow: { duration: 1, repeat: piece.canMove ? Infinity : 0 }
      }}
      layout
    >
      {/* Piece highlight */}
      <motion.div
        className="absolute inset-1 rounded-full bg-white bg-opacity-20"
        animate={{
          opacity: piece.canMove ? [0.2, 0.5, 0.2] : 0.2
        }}
        transition={{ duration: 1, repeat: piece.canMove ? Infinity : 0 }}
      />
      
      {/* Player number */}
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
        {player}
      </div>
    </motion.div>
  );
};

export default GamePiece;