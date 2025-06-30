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
        <Empty
          title="Welcome to Dice Dynasty"
          message="Ready to start your royal conquest on the board?"
          actionText="Setup New Game"
          onAction={() => setGameStatus('setup')}
        />
      );
  }
};

export default GamePage;