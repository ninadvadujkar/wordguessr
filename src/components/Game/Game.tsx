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
    console.log('words', wordsToGuess);
    const rounds = wordsToGuess.map((word) => {
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

  const onChange = (rowIndex: number, cellIndex: number, value: string, cellToFocus?: HTMLInputElement) => {
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
    cellToFocus && cellToFocus.focus();
  };

  const onRowSubmit = async (updatedRow: CellData[]) => {
    console.log('on row submit');
    setGameState((currentState) => {
      return {
        ...currentState,
        rounds: currentState?.rounds.map((round, index) => {
          if (index !== currentState?.currentRoundIndex) {
            return round;
          }
          return {
            ...round,
            board: round.board.map((row, rIndex) => {
              if (rIndex !== round.currentBoardRow) {
                return row;
              }
              return updatedRow;
            }),
            currentBoardRow: round.currentBoardRow + 1
          };
        })
      } as GameState;
    });
    return;
  };

  return (<>
    {gameState && <Board
      board={gameState?.rounds[gameState.currentRoundIndex].board}
      wordToGuess={gameState?.rounds[gameState.currentRoundIndex].wordToGuess}
      currentRow={gameState.rounds[gameState.currentRoundIndex].currentBoardRow}
      onChange={onChange}
      onRowSubmit={onRowSubmit}
    />}
  </>);
};

export default Game;