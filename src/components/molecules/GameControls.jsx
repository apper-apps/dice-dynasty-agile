import { motion } from 'framer-motion';
import Dice from '@/components/atoms/Dice';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const GameControls = ({ 
  gameState, 
  onRollDice, 
  onQuitGame,
  onNewGame 
}) => {
  const { currentPlayerIndex, players, diceValue, isRolling, gameStatus } = gameState;
  const currentPlayer = players[currentPlayerIndex];

  if (gameStatus === 'finished') {
return (
      <Card variant="ludo" className="p-6">
        <div className="text-center">
          <motion.div
            className="mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <ApperIcon name="Trophy" size={48} className="text-accent mx-auto" />
          </motion.div>
<h3 className="text-2xl font-fredoka text-gray-800 mb-2">
            Game Over!
          </h3>
<p className="text-gray-700 mb-6 text-lg">
            Winner: <span className="font-bold text-xl" style={{ color: gameState.winner?.color }}>
              {gameState.winner?.name}
            </span>
          </p>

          <div className="space-y-3">
            <Button
              icon="RotateCcw"
              onClick={onNewGame}
              className="w-full"
            >
              New Game
            </Button>
            
            <Button
              variant="outline"
              icon="Home"
              onClick={onQuitGame}
              className="w-full"
            >
              Main Menu
            </Button>
          </div>
        </div>
      </Card>
    );
  }

return (
    <Card variant="ludo" className="p-6">
      {/* Current Player Info */}
<div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <ApperIcon name="User" size={20} className="mr-2 text-warning" />
          Current Turn
        </h3>
        
<motion.div 
          className="flex items-center p-4 rounded-xl border-3 bg-white bg-opacity-50"
          style={{ 
            borderColor: currentPlayer?.color,
            backgroundColor: `${currentPlayer?.color}20`
          }}
          animate={{
            boxShadow: [`0 0 20px ${currentPlayer?.color}40`, `0 0 30px ${currentPlayer?.color}60`, `0 0 20px ${currentPlayer?.color}40`]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div 
            className="w-6 h-6 rounded-full mr-3 shadow-lg"
            style={{ backgroundColor: currentPlayer?.color }}
          />
<div>
            <div className="font-bold text-gray-800 text-lg">
              {currentPlayer?.name}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {currentPlayer?.isAI ? `AI (${currentPlayer.difficulty})` : 'Human Player'}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Dice Section */}
<div className="mb-6">
        <h4 className="text-md font-bold text-gray-800 mb-3 flex items-center">
          <ApperIcon name="Dices" size={18} className="mr-2 text-warning" />
          Dice Roll
        </h4>
        
        <div className="flex items-center justify-between">
          <Dice
            value={diceValue || 1}
            isRolling={isRolling}
            onClick={onRollDice}
            disabled={isRolling || currentPlayer?.isAI}
          />
          
          <div className="text-right">
{diceValue > 0 && (
              <motion.div 
                className="text-3xl font-bold text-gray-800 mb-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {diceValue}
              </motion.div>
            )}
            
            <Button
              onClick={onRollDice}
              disabled={isRolling || currentPlayer?.isAI}
              size="sm"
              className="min-w-[80px]"
            >
              {isRolling ? 'Rolling...' : 'Roll'}
            </Button>
          </div>
        </div>
      </div>

      {/* Player Pieces Status */}
<div className="mb-6">
        <h4 className="text-md font-bold text-gray-800 mb-3 flex items-center">
          <ApperIcon name="Target" size={18} className="mr-2 text-warning" />
          Pieces Status
        </h4>
        
        <div className="space-y-2">
          {players.map((player, index) => {
            const piecesHome = player.pieces.filter(p => p.isHome).length;
            const piecesOnBoard = player.pieces.filter(p => p.position >= 0 && !p.isHome).length;
            const piecesInBase = player.pieces.filter(p => p.position === -1).length;
            
            return (
<motion.div
                key={player.Id}
                className="flex items-center justify-between p-3 rounded-lg bg-white border-2"
                animate={{
                  borderColor: index === currentPlayerIndex ? player.color : '#D1D5DB',
                  backgroundColor: index === currentPlayerIndex ? `${player.color}15` : '#FFFFFF'
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: player.color }}
/>
                  <span className="text-sm text-gray-800 font-bold">
                    {player.name}
                  </span>
                </div>
                
<div className="flex space-x-3 text-xs text-gray-600 font-medium">
                  <span>Home: {piecesHome}</span>
                  <span>Board: {piecesOnBoard}</span>
                  <span>Base: {piecesInBase}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Game Actions */}
      <div className="space-y-3">
        <Button
          variant="outline"
          icon="RotateCcw"
          onClick={onNewGame}
          className="w-full"
          size="sm"
        >
          New Game
        </Button>
        
        <Button
          variant="ghost"
          icon="Home"
          onClick={onQuitGame}
          className="w-full"
          size="sm"
        >
          Main Menu
        </Button>
      </div>
    </Card>
  );
};

export default GameControls;