import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom"
import { LetterFoundState, RoundOutcomeState } from '../../enums/common.enums';
import { CellData, GameState, Round } from '../../types/common.types';
import { isLetter } from '../../utils/common.utils';
import Board from '../Board/Board';
import Summary from '../Summary/Summary';
import * as S from './Game.styles';

const Game = () => {
  const [gameState, setGameState] = useState<GameState>();
  const params = useParams();

  useEffect(() => {
    if (!gameState || !params.gameId) {
      return;
    }

    localStorage.setItem(`gameState-${params.gameId}`, JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    if (!params.gameId) {
      return;
    }

    const localStorageGameState = localStorage.getItem(`gameState-${params.gameId}`);
    console.log('asas', `gameState-${params.gameId}`, localStorageGameState);
    // reset game from last checkpoint if user refreshes or closes browser
    if (localStorageGameState) {
      setGameState(JSON.parse(localStorageGameState));
      return;
    }

    // start fresh game
    const decodedGameId = window.atob(params.gameId);
    const wordsToGuess = decodedGameId.split(',');
    const rounds = wordsToGuess.map((word) => {
      return {
        outcomeState: RoundOutcomeState.INDETERMINATE,
        wordToGuess: word.trim(),
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
        ...currentState,
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
      } as GameState;
    });
    cellToFocus && cellToFocus.focus();
  };

  const onRowSubmit = async (updatedRow: CellData[], outcome: RoundOutcomeState) => {
    const outcomeIndeterminate = outcome === RoundOutcomeState.INDETERMINATE;
    setGameState((currentState) => {
      return {
        ...currentState,
        rounds: currentState?.rounds.map((round, index) => {
          if (index !== currentState?.currentRoundIndex) {
            return round;
          }
          return {
            ...round,
            outcomeState: outcome,
            board: round.board.map((row, rIndex) => {
              if (rIndex !== round.currentBoardRow) {
                return row;
              }
              return updatedRow;
            }),
            currentBoardRow: outcomeIndeterminate ? round.currentBoardRow + 1 : round.currentBoardRow
          };
        }),
      } as GameState;
    });
    if (!outcomeIndeterminate) {      
      setTimeout(() => {
        alert(`You ${outcome} this round. Correct word: ${gameState?.rounds[gameState?.currentRoundIndex].wordToGuess}`);
        setGameState((currentState) => {
          return {
            ...currentState,
            currentRoundIndex: (currentState?.currentRoundIndex ?? 0) + 1
          } as GameState;
        });
      }, 500);
    }
    return;
  };

  return (<>
    {gameState &&
      <S.Title>{
        gameState.currentRoundIndex === gameState.rounds.length ?
          'Summary' :
          `Round ${gameState.currentRoundIndex + 1} / ${gameState.rounds.length}`}
      </S.Title>}
    {gameState && gameState.currentRoundIndex !== gameState.rounds.length && <Board
      board={gameState.rounds[gameState.currentRoundIndex].board}
      wordToGuess={gameState.rounds[gameState.currentRoundIndex].wordToGuess}
      currentRow={gameState.rounds[gameState.currentRoundIndex].currentBoardRow}
      currentRound={gameState.currentRoundIndex}
      onChange={onChange}
      onRowSubmit={onRowSubmit}
    />}
    {gameState && gameState.currentRoundIndex === gameState.rounds.length && <Summary boards={gameState?.rounds.map(r => ({
      board: r.board,
      currentRow: 100
    }))} />}
  </>);
};

export default Game;