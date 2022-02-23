import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useSearchParams } from "react-router-dom"
import { LetterFoundState, RoundOutcomeState } from '../../enums/common.enums';
import { CellData, GameState, Round } from '../../types/common.types';
import { isLetter } from '../../utils/common.utils';
import Board from '../Board/Board';
import Summary from '../Summary/Summary';
import ToastMessage from '../Toast/Toast';
import * as S from './Game.styles';

const Game = () => {
  const [gameState, setGameState] = useState<GameState>();
  const [searchParams] = useSearchParams();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!gameState || !searchParams.get('gameId')) {
      return;
    }

    localStorage.setItem(`gameState-${searchParams.get('gameId')}`, JSON.stringify(gameState));
  }, [gameState, searchParams]);

  useEffect(() => {
    const gameId = searchParams.get('gameId');
    if (!gameId) {
      return;
    }

    const localStorageGameState = localStorage.getItem(`gameState-${gameId}`);
    // reset game from last checkpoint if user refreshes or closes browser
    if (localStorageGameState) {
      setGameState(JSON.parse(localStorageGameState));
      return;
    }

    // start fresh game
    const decodedGameId = window.atob(gameId);
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
  }, [searchParams]);

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
        alert(`You ${outcome} this round. Correct word: ${gameState?.rounds[gameState?.currentRoundIndex].wordToGuess.toUpperCase()}`);
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

  const shareResult = () => {
    const result = gameState?.rounds.map((r, i) => {
      return `Round ${i + 1}/${gameState?.rounds.length}\n\n${r.board.map(row => {
          return row.map(i => {
            switch (i.foundState) {
              case LetterFoundState.NO:
                return '⬛';
              case LetterFoundState.YES_NO_SAME_INDEX:
                return '🟨';
              case LetterFoundState.YES_SAME_INDEX:
                return '🟩';
              default:
                return '';
            }
          }).join('');
        }).join('\n')}
      `;
    }).join('\n');
    if (!result) {
      return;
    }
    const finalResult = `Wordguessr\n\n${result}`;
    console.log(finalResult);
    navigator.clipboard.writeText(finalResult);
    setShowToast(true);
    setToastMessage('Result copied to clipboard!');
  };

  return (<>
    <ToastMessage show={showToast} message={toastMessage} onClose={() => setShowToast(false)} />
    {gameState &&
      <S.Title>{
        gameState.currentRoundIndex === gameState.rounds.length ?
          <div>Summary <Button type="button" variant="primary" onClick={() => shareResult()}>Share Result</Button></div> :
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
    {gameState && gameState.currentRoundIndex === gameState.rounds.length && <Summary rounds={gameState?.rounds.map(r => ({
      ...r,
      wordToGuess: r.wordToGuess.toUpperCase(),
      currentRow: 100
    }))} />}
  </>);
};

export default Game;