'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
  const [isPumpkinNext, setIsPumpkinNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [score, setScore] = useState({ Pumpkin: 0, Ghost: 0, Draw: 0 });
  const [scoreAnimation, setScoreAnimation] = useState({ Pumpkin: false, Ghost: false, Draw: false });
  const [showConfetti, setShowConfetti] = useState(false);

  const calculateWinner = (squares: Array<string | null>) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.every(square => square !== null) ? 'Draw' : null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = board.slice();
    newBoard[index] = isPumpkinNext ? '🎃' : '👻';
    setBoard(newBoard);
    setIsPumpkinNext(!isPumpkinNext);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      const winnerKey = gameWinner === 'Draw' ? 'Draw' : (gameWinner === '🎃' ? 'Pumpkin' : 'Ghost');
      setScore(prev => ({
        ...prev,
        [winnerKey]: prev[winnerKey] + 1
      }));
      setScoreAnimation(prev => ({
        ...prev,
        [winnerKey]: true
      }));
      setShowConfetti(true);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPumpkinNext(true);
    setWinner(null);
    setShowConfetti(false);
  };

  const renderSquare = (index: number) => (
    <Button
      variant="outline"
      className="w-full h-16 sm:h-20 md:h-24 text-2xl sm:text-3xl font-bold bg-gradient-to-br from-orange-800 to-black hover:from-orange-700 hover:to-gray-900 transition-colors flex items-center justify-center text-white"
      onClick={() => handleClick(index)}
    >
      {board[index]}
    </Button>
  );

  const status = winner
    ? winner === 'Draw'
      ? '🎃👻 Game is a Draw!'
      : `🏮 Winner: ${winner === '🎃' ? 'Pumpkin' : 'Ghost'}`
    : `Next player: ${isPumpkinNext ? '🎃 Pumpkin' : '👻 Ghost'}`;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (scoreAnimation.Pumpkin || scoreAnimation.Ghost || scoreAnimation.Draw) {
      timer = setTimeout(() => setScoreAnimation({ Pumpkin: false, Ghost: false, Draw: false }), 1000);
    }
    if (showConfetti) {
      timer = setTimeout(() => setShowConfetti(false), 3000); // Confetti lasts 3 seconds
    }
    return () => clearTimeout(timer);
  }, [scoreAnimation, showConfetti]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-orange-900 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-gray-800/90 shadow-lg rounded-xl border border-orange-500">
        <CardHeader className="bg-gradient-to-r from-black to-orange-700 text-white rounded-t-xl p-3 sm:p-4">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl text-center font-bold">Halloween Tic-Tac-Toe 🎃👻</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="text-center mb-2 sm:mb-4 text-base sm:text-lg md:text-xl font-semibold text-yellow-300">{status}</div>
          <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-4">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="flex items-center justify-center">{renderSquare(index)}</div>
            ))}
          </div>
          <div className="text-center mb-2 sm:mb-4">
            <p className="text-base sm:text-lg font-semibold text-yellow-300">Scores:</p>
            <div className="flex justify-center gap-4 text-lg sm:text-xl">
              <span className={scoreAnimation.Pumpkin ? 'animate-bounce text-orange-500' : 'text-orange-500'}>🎃 Pumpkin: {score.Pumpkin}</span>
              <span className={scoreAnimation.Ghost ? 'animate-bounce text-blue-300' : 'text-blue-300'}>👻 Ghost: {score.Ghost}</span>
              <span className={scoreAnimation.Draw ? 'animate-bounce text-purple-400' : 'text-purple-400'}>🎃👻 Draw: {score.Draw}</span>
            </div>
          </div>
          <div className="mt-2 sm:mt-4 text-center">
            <Button
              onClick={resetGame}
              className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-1 px-2 sm:py-2 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
            >
              Reset Game 🔮
            </Button>
          </div>
        </CardContent>
      </Card>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 confetti">
            <div className="confetti-piece bg-orange-500"></div>
            <div className="confetti-piece bg-purple-400"></div>
            <div className="confetti-piece bg-yellow-300"></div>
            <div className="confetti-piece bg-blue-300"></div>
          </div>
          <style jsx>{`
            .confetti-piece {
              position: absolute;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              animation: fall 3s infinite linear;
            }
            @keyframes fall {
              0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
            }
            .confetti-piece:nth-child(1) { left: 10%; animation-delay: 0s; }
            .confetti-piece:nth-child(2) { left: 30%; animation-delay: 0.5s; }
            .confetti-piece:nth-child(3) { left: 50%; animation-delay: 1s; }
            .confetti-piece:nth-child(4) { left: 70%; animation-delay: 1.5s; }
          `}</style>
        </div>
      )}
    </div>
  );
}