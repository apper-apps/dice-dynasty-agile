import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import GameBoard from '@/components/molecules/GameBoard';
import GameControls from '@/components/molecules/GameControls';
import VictoryModal from '@/components/molecules/VictoryModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import gameService from '@/services/api/gameService';

const GameInterface = ({ playerConfigs, onQuitGame }) => {
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVictoryModal, setShowVictoryModal] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  // Handle AI turns
  useEffect(() => {
    if (gameState && gameState.gameStatus === 'playing') {
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      if (currentPlayer?.isAI) {
        const timer = setTimeout(() => {
          handleAITurn();
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [gameState?.currentPlayerIndex, gameState?.gameStatus]);

  // Check for victory
  useEffect(() => {
    if (gameState?.gameStatus === 'finished' && gameState.winner) {
      setShowVictoryModal(true);
      toast.success(`${gameState.winner.name} wins the game!`, {
        position: "top-center",
        autoClose: 5000,
      });
    }
  }, [gameState?.gameStatus, gameState?.winner]);

  const initializeGame = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const newGameState = await gameService.setupGame(playerConfigs);
      setGameState(newGameState);
      
      toast.success("Game started! Roll the dice to begin.", {
        position: "top-right"
      });
    } catch (err) {
      setError(err.message || "Failed to initialize game");
      toast.error("Failed to start game. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRollDice = async () => {
    if (!gameState || gameState.gameStatus !== 'playing') return;
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.isAI) return;

    try {
      const result = await gameService.rollDice();
      setGameState(result.gameState);
      
      // Check if player has any movable pieces
      const movablePieces = currentPlayer.pieces.filter(piece => piece.canMove);
      if (movablePieces.length === 0) {
        toast.info(`No available moves! ${result.diceValue === 6 ? "You need 6 to start." : "Turn passes."}`);
        
        // Auto-advance turn if no moves available and didn't roll 6
        if (result.diceValue !== 6) {
          setTimeout(() => {
            gameService.getGameState().then(setGameState);
          }, 1500);
        }
      } else {
        toast.info(`Rolled ${result.diceValue}! Click a highlighted piece to move.`);
      }
    } catch (err) {
      toast.error("Failed to roll dice. Please try again.");
    }
  };

  const handlePieceClick = async (pieceId) => {
    if (!gameState || gameState.gameStatus !== 'playing') return;
    
    const piece = gameState.pieces[pieceId];
    if (!piece?.canMove) {
      toast.warning("This piece cannot move!");
      return;
    }

    try {
      const result = await gameService.movePiece(pieceId);
      
      if (result.success) {
        setGameState(result.gameState);
        
        if (result.captured) {
          toast.success(`Captured ${result.captured.playerId}'s piece!`, {
            position: "top-center"
          });
        }
        
        if (result.winner) {
          // Victory handled by useEffect
        } else {
          const currentPlayer = result.gameState.players[result.gameState.currentPlayerIndex];
          toast.info(`${currentPlayer.name}'s turn`);
        }
      } else {
        toast.error(result.message || "Invalid move");
      }
    } catch (err) {
      toast.error("Failed to move piece. Please try again.");
    }
  };

  const handleAITurn = async () => {
    try {
      await gameService.makeAIMove();
      const updatedState = await gameService.getGameState();
      setGameState(updatedState);
    } catch (err) {
      toast.error("AI player encountered an error");
    }
  };

  const handleNewGame = async () => {
    setShowVictoryModal(false);
    await initializeGame();
  };

  const handleMainMenu = () => {
    setShowVictoryModal(false);
    onQuitGame();
  };

  const retryGame = () => {
    setError(null);
    initializeGame();
  };

  if (loading) {
    return <Loading message="Setting up the game board..." />;
  }

  if (error) {
    return <Error message={error} onRetry={retryGame} />;
  }

  if (!gameState) {
    return <Error message="Failed to load game state" onRetry={retryGame} />;
  }

return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Game Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
>
          <h1 className="text-5xl font-fredoka gradient-text mb-2 drop-shadow-lg">
            Ludo Master
          </h1>
          <p className="text-gray-700 text-lg font-semibold">
            Turn {gameState.turnCount + 1} • {gameState.gameStatus === 'playing' ? 'Game in Progress' : 'Game Over'}
          </p>
        </motion.div>

        {/* Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Board - Takes up most space */}
          <div className="lg:col-span-3 flex justify-center">
            <GameBoard
              gameState={gameState}
              onPieceClick={handlePieceClick}
            />
          </div>

          {/* Game Controls - Sidebar */}
          <div className="lg:col-span-1">
            <GameControls
              gameState={gameState}
              onRollDice={handleRollDice}
              onQuitGame={onQuitGame}
              onNewGame={handleNewGame}
            />
          </div>
        </div>

        {/* Turn Instructions */}
        {gameState.gameStatus === 'playing' && (
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
>
            <div className="inline-flex items-center px-8 py-4 bg-cardBg rounded-full border-3 border-warning shadow-ludo-lg">
              <div 
                className="w-6 h-6 rounded-full mr-4 border-2 border-white shadow-piece"
                style={{ backgroundColor: gameState.players[gameState.currentPlayerIndex]?.color }}
              />
              <span className="text-gray-800 font-semibold text-lg">
                {gameState.players[gameState.currentPlayerIndex]?.isAI 
                  ? "AI is thinking..." 
                  : gameState.diceValue > 0 
                    ? "Click a highlighted piece to move" 
                    : "Roll the dice to continue"
                }
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Victory Modal */}
      <VictoryModal
        winner={gameState.winner}
        onNewGame={handleNewGame}
        onMainMenu={handleMainMenu}
        isVisible={showVictoryModal}
      />
    </div>
  );
};

export default GameInterface;