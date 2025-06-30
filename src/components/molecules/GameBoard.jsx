import { motion } from 'framer-motion';
import GamePiece from '@/components/atoms/GamePiece';

const GameBoard = ({ gameState, onPieceClick }) => {
  const { players, pieces, boardPositions } = gameState;

  // Board layout configuration
  const BOARD_SIZE = 15;
  const CELL_SIZE = 40;

  // Generate board grid positions
  const generateBoardLayout = () => {
    const layout = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
    
    // Define the main path positions
    const mainPath = [
      // Bottom row (left to right)
      { row: 14, col: 6 }, { row: 14, col: 7 }, { row: 14, col: 8 },
      { row: 13, col: 8 }, { row: 12, col: 8 }, { row: 11, col: 8 },
      { row: 10, col: 8 }, { row: 9, col: 8 },
      // Right column (bottom to top)
      { row: 8, col: 8 }, { row: 8, col: 9 }, { row: 8, col: 10 },
      { row: 8, col: 11 }, { row: 8, col: 12 }, { row: 8, col: 13 },
      // Top row (right to left)
      { row: 8, col: 14 }, { row: 7, col: 14 }, { row: 6, col: 14 },
      { row: 6, col: 13 }, { row: 6, col: 12 }, { row: 6, col: 11 },
      { row: 6, col: 10 }, { row: 6, col: 9 },
      // Left column (top to bottom)
      { row: 6, col: 8 }, { row: 5, col: 8 }, { row: 4, col: 8 },
      { row: 3, col: 8 }, { row: 2, col: 8 }, { row: 1, col: 8 },
      // Continue path
      { row: 0, col: 8 }, { row: 0, col: 7 }, { row: 0, col: 6 },
      { row: 1, col: 6 }, { row: 2, col: 6 }, { row: 3, col: 6 },
      { row: 4, col: 6 }, { row: 5, col: 6 },
      // More path positions...
      { row: 6, col: 6 }, { row: 6, col: 5 }, { row: 6, col: 4 },
      { row: 6, col: 3 }, { row: 6, col: 2 }, { row: 6, col: 1 },
      { row: 6, col: 0 }, { row: 7, col: 0 }, { row: 8, col: 0 },
      { row: 8, col: 1 }, { row: 8, col: 2 }, { row: 8, col: 3 },
      { row: 8, col: 4 }, { row: 8, col: 5 }, { row: 8, col: 6 }
    ];

    // Mark main path positions
    mainPath.forEach((pos, index) => {
      if (pos.row >= 0 && pos.row < BOARD_SIZE && pos.col >= 0 && pos.col < BOARD_SIZE) {
        layout[pos.row][pos.col] = { type: 'path', index };
      }
    });

    // Home bases
    const homeBases = [
      // Player 1 (bottom-left)
      { positions: [[12, 1], [12, 2], [13, 1], [13, 2]], color: '#6366F1' },
      // Player 2 (bottom-right) 
      { positions: [[12, 12], [12, 13], [13, 12], [13, 13]], color: '#EC4899' },
      // Player 3 (top-right)
      { positions: [[1, 12], [1, 13], [2, 12], [2, 13]], color: '#10B981' },
      // Player 4 (top-left)
      { positions: [[1, 1], [1, 2], [2, 1], [2, 2]], color: '#F59E0B' }
    ];

    homeBases.forEach((base, playerIndex) => {
      base.positions.forEach((pos, pieceIndex) => {
        const [row, col] = pos;
        layout[row][col] = { 
          type: 'home', 
          playerId: playerIndex + 1, 
          pieceIndex,
          color: base.color 
        };
      });
    });

    // Home columns (center areas leading to victory)
    const homeColumns = [
      // Player 1 column
      { positions: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]], color: '#6366F1', playerId: 1 },
      // Player 2 column
      { positions: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]], color: '#EC4899', playerId: 2 },
      // Player 3 column
      { positions: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]], color: '#10B981', playerId: 3 },
      // Player 4 column
      { positions: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]], color: '#F59E0B', playerId: 4 }
    ];

    homeColumns.forEach((column) => {
      column.positions.forEach((pos, index) => {
        const [row, col] = pos;
        layout[row][col] = { 
          type: 'homeColumn', 
          playerId: column.playerId,
          index,
          color: column.color 
        };
      });
    });

    // Safe zones (star positions)
    const safeZones = [
      { row: 8, col: 2 }, { row: 2, col: 8 }, { row: 6, col: 12 }, { row: 12, col: 6 }
    ];

    safeZones.forEach((pos) => {
      if (layout[pos.row][pos.col]) {
        layout[pos.row][pos.col].safe = true;
      }
    });

    return layout;
  };

  const boardLayout = generateBoardLayout();

  const getCellContent = (cell, row, col) => {
    if (!cell) return null;

    // Find pieces at this position
    const piecesAtPosition = Object.values(pieces).filter(piece => {
      if (piece.position === -1) {
        // Piece in home base
        const player = players.find(p => p.Id === piece.playerId);
        const homePositions = getHomePositions(piece.playerId);
        const pieceIndex = piece.Id.split('-')[1] - 1;
        return homePositions[pieceIndex] && 
               homePositions[pieceIndex].row === row && 
               homePositions[pieceIndex].col === col;
      } else if (typeof piece.position === 'number') {
        // Piece on main path or home column
        const boardPos = getBoardPosition(piece.position);
        return boardPos && boardPos.row === row && boardPos.col === col;
      }
      return false;
    });

    return (
      <div className="relative w-full h-full">
        {/* Cell background */}
        <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${getCellStyle(cell)}`} />
        
        {/* Safe zone indicator */}
        {cell.safe && (
          <div className="absolute inset-1 rounded-md bg-gradient-to-br from-success/30 to-emerald-400/30 border border-success/50" />
        )}
        
        {/* Pieces */}
        {piecesAtPosition.map((piece, index) => (
          <GamePiece
            key={piece.Id}
            piece={piece}
            onClick={() => onPieceClick(piece.Id)}
            style={{
              position: 'absolute',
              top: `${index * 2}px`,
              left: `${index * 2}px`,
              zIndex: 10 + index
            }}
          />
        ))}
      </div>
    );
  };

  const getCellStyle = (cell) => {
    const baseStyle = "border border-gray-600";
    
    switch (cell.type) {
      case 'path':
        return `${baseStyle} bg-gray-700 hover:bg-gray-600`;
      case 'home':
        return `${baseStyle} bg-opacity-30 border-opacity-50`;
      case 'homeColumn':
        return `${baseStyle} bg-opacity-20 border-opacity-40`;
      default:
        return `${baseStyle} bg-gray-800`;
    }
  };

  const getHomePositions = (playerId) => {
    const homeMap = {
      1: [{ row: 12, col: 1 }, { row: 12, col: 2 }, { row: 13, col: 1 }, { row: 13, col: 2 }],
      2: [{ row: 12, col: 12 }, { row: 12, col: 13 }, { row: 13, col: 12 }, { row: 13, col: 13 }],
      3: [{ row: 1, col: 12 }, { row: 1, col: 13 }, { row: 2, col: 12 }, { row: 2, col: 13 }],
      4: [{ row: 1, col: 1 }, { row: 1, col: 2 }, { row: 2, col: 1 }, { row: 2, col: 2 }]
    };
    return homeMap[playerId] || [];
  };

  const getBoardPosition = (position) => {
    // Map logical position to board coordinates
    const pathMap = [
      { row: 14, col: 6 }, { row: 14, col: 7 }, { row: 14, col: 8 },
      { row: 13, col: 8 }, { row: 12, col: 8 }, { row: 11, col: 8 },
      { row: 10, col: 8 }, { row: 9, col: 8 }, { row: 8, col: 8 },
      { row: 8, col: 9 }, { row: 8, col: 10 }, { row: 8, col: 11 },
      { row: 8, col: 12 }, { row: 8, col: 13 }, { row: 8, col: 14 },
      { row: 7, col: 14 }, { row: 6, col: 14 }, { row: 6, col: 13 },
      { row: 6, col: 12 }, { row: 6, col: 11 }, { row: 6, col: 10 },
      { row: 6, col: 9 }, { row: 6, col: 8 }, { row: 5, col: 8 },
      { row: 4, col: 8 }, { row: 3, col: 8 }, { row: 2, col: 8 },
      { row: 1, col: 8 }, { row: 0, col: 8 }, { row: 0, col: 7 },
      { row: 0, col: 6 }, { row: 1, col: 6 }, { row: 2, col: 6 },
      { row: 3, col: 6 }, { row: 4, col: 6 }, { row: 5, col: 6 },
      { row: 6, col: 6 }, { row: 6, col: 5 }, { row: 6, col: 4 },
      { row: 6, col: 3 }, { row: 6, col: 2 }, { row: 6, col: 1 },
      { row: 6, col: 0 }, { row: 7, col: 0 }, { row: 8, col: 0 },
      { row: 8, col: 1 }, { row: 8, col: 2 }, { row: 8, col: 3 },
      { row: 8, col: 4 }, { row: 8, col: 5 }, { row: 8, col: 6 }
    ];

    // Home columns start at position 52
    if (position >= 52) {
      const homeColumnMap = {
        52: { row: 13, col: 7 }, 53: { row: 12, col: 7 }, 54: { row: 11, col: 7 }, 55: { row: 10, col: 7 }, 56: { row: 9, col: 7 },
        57: { row: 7, col: 13 }, 58: { row: 7, col: 12 }, 59: { row: 7, col: 11 }, 60: { row: 7, col: 10 }, 61: { row: 7, col: 9 },
        62: { row: 1, col: 7 }, 63: { row: 2, col: 7 }, 64: { row: 3, col: 7 }, 65: { row: 4, col: 7 }, 66: { row: 5, col: 7 },
        67: { row: 7, col: 1 }, 68: { row: 7, col: 2 }, 69: { row: 7, col: 3 }, 70: { row: 7, col: 4 }, 71: { row: 7, col: 5 }
      };
      return homeColumnMap[position];
    }

    return pathMap[position] || null;
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-700"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        className="grid gap-1 mx-auto"
        style={{ 
          gridTemplateColumns: `repeat(${BOARD_SIZE}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, ${CELL_SIZE}px)`
        }}
      >
        {boardLayout.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <motion.div
              key={`${rowIndex}-${colIndex}`}
              className="relative"
              style={{ width: CELL_SIZE, height: CELL_SIZE }}
              whileHover={cell ? { scale: 1.05 } : {}}
              transition={{ duration: 0.2 }}
            >
              {getCellContent(cell, rowIndex, colIndex)}
            </motion.div>
          ))
        )}
      </div>

      {/* Board center logo */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-2xl border-4 border-white border-opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <span className="text-white font-righteous text-lg">DD</span>
      </motion.div>
    </motion.div>
  );
};

export default GameBoard;