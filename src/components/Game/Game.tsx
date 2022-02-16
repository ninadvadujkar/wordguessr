import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom"
import { LetterFoundState, RoundOutcomeState } from '../../enums/common.enums';
import { CellData, GameState, Round } from '../../types/common.types';
import { isLetter } from '../../utils/common.utils';
import Board from '../Board/Board';

const Game = () => {
  const [gameState, setGameState] = useState<GameState>();
  const params = useParams();

  useEffect(() => {
    console.log('game state', gameState);
  }, [gameState]);

  useEffect(() => {
    if (!params.gameId) {
      return;
    }

    const decodedGameId = window.atob(params.gameId);
    const wordsToGuess = JSON.parse(decodedGameId) as string[];
    const rounds = wordsToGuess.map((word, index) => {
      return {
        outcomeState: RoundOutcomeState.INDETERMINATE,
        wordToGuess: word,
        board: [...Array(6)]
          .map(() =>
            Array(5).fill({ letter: '', foundState: LetterFoundState.INDETERMINATE } as CellData)
          ),
        currentBoardRow: 0
      } as Round;
    });
    setGameState({
      rounds,
      currentRoundIndex: 0
    });
  }, [params]);

  const onChange = (rowIndex: number, cellIndex: number, value: string) => {
    if (value && !isLetter(value)) {
      return;
    }
    setGameState((currentState) => {
      return {
        rounds: currentState?.rounds.map((round, index) => {
          if (index !== currentState?.currentRoundIndex) {
            return round;
          }
          return {
            ...round,
            board: round.board.map((row, rIndex) => {
              return row.map((cell, cIndex) => {
                if (rIndex === rowIndex && cIndex === cellIndex) {
                  console.log('....', value);
                  return { ...cell, letter: value.toUpperCase() };
                }
                return cell;
              });
            })
          };
        }),
        currentRoundIndex: currentState?.currentRoundIndex
      } as GameState;
    });
  };

  return (<>
    <h1>Game</h1>
    {gameState && <Board
      board={gameState?.rounds[gameState.currentRoundIndex].board}
      currentRow={gameState.rounds[gameState.currentRoundIndex].currentBoardRow}
      onChange={onChange}
    />}
  </>);
};

export default Game;