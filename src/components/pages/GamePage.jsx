import { useState } from 'react';
import PlayerSetup from '@/components/molecules/PlayerSetup';
import GameInterface from '@/components/organisms/GameInterface';
import Empty from '@/components/ui/Empty';

const GamePage = () => {
  const [gameStatus, setGameStatus] = useState('setup'); // setup, playing, ended
  const [playerConfigs, setPlayerConfigs] = useState([]);

  const handleStartGame = (configs) => {
    setPlayerConfigs(configs);
    setGameStatus('playing');
  };

  const handleQuitGame = () => {
    setGameStatus('setup');
    setPlayerConfigs([]);
  };

  const handleNewGame = () => {
    setGameStatus('setup');
  };

  switch (gameStatus) {
    case 'setup':
      return <PlayerSetup onStartGame={handleStartGame} />;
    
    case 'playing':
      return (
        <GameInterface 
          playerConfigs={playerConfigs}
          onQuitGame={handleQuitGame}
          onNewGame={handleNewGame}
        />
      );
    
    default:
return (
        <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
          <Empty
            title="Welcome to Ludo Master"
            message="Ready to start your classic board game adventure?"
            actionText="Setup New Game"
            onAction={() => setGameStatus('setup')}
          />
        </div>
      );
  }
};

export default GamePage;