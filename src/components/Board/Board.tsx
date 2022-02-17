import React, { useState } from 'react';
import { useEffect } from 'react';
import { BoardData, CellData } from '../../types/common.types';
import ToastMessage from '../Toast/Toast';
import Grid from '../Grid/Grid';
import { dictionary } from '../../words-dictionary';
import { LetterFoundState, RoundOutcomeState } from '../../enums/common.enums';
import { createHashOfIndexes } from '../../utils/common.utils';
import * as S from './Board.styles';


interface Props {
  board: BoardData;
  wordToGuess: string;
  currentRow: number;
  onChange: (rowIndex: number, cellIndex: number, value: string, cellToFocus?: HTMLInputElement) => void;
  onRowSubmit: (updatedRow: CellData[], outcomeState: RoundOutcomeState) => Promise<void>;
}

const Board: React.FC<Props> = ({ board, wordToGuess, currentRow, onChange, onRowSubmit }) => {
  const [references, setReferences] = useState<React.RefObject<HTMLInputElement>[][]>();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    setReferences(
      board.map(row => row.map(() => React.createRef()))
    );
  }, []);

  const isInvalid = (guessedWord: string) => {
    if (guessedWord.length !== 5) {
      setShowToast(true);
      setToastMessage('Not enough letters');
      return true;
    }
    if (!dictionary.includes(guessedWord)) {
      setShowToast(true);
      setToastMessage('Not in word list');
      return true;
    }
    return false;
  };

  const determineGuess = (guessedWord: string): [CellData[], boolean] => {
    if (wordToGuess === guessedWord) {
      return [guessedWord.split('').map(letter => ({ letter: letter.toUpperCase(), foundState: LetterFoundState.YES_SAME_INDEX })), true];
    }

    const hashOfWordToGuess = createHashOfIndexes(wordToGuess);
    const hashOfGuessedWord = createHashOfIndexes(guessedWord);

    const updatedRow: CellData[] = [];
    Object.entries(hashOfGuessedWord).forEach(([key, value]) => {
      const letter = key.toUpperCase();
      if (!hashOfWordToGuess[key] || !hashOfWordToGuess[key].length) {
        value.forEach(i => updatedRow[i] = ({ letter, foundState: LetterFoundState.NO }));
      } else {
        value.forEach(i => {
          const index = hashOfWordToGuess[key].indexOf(i);
          if (index !== -1) {
            updatedRow[i] = { letter, foundState: LetterFoundState.YES_SAME_INDEX };
            hashOfWordToGuess[key].splice(index, 1);
          }
        });
        value.forEach((i, index) => {
          if (!updatedRow[i]) {
            if (typeof hashOfWordToGuess[key][index] === 'number') {
              updatedRow[i] = ({ letter, foundState: LetterFoundState.YES_NO_SAME_INDEX });
            } else {
              updatedRow[i] = ({ letter, foundState: LetterFoundState.NO });
            }
          }
        });
      }
    });
    return [updatedRow, updatedRow.every(c => c.foundState === LetterFoundState.YES_SAME_INDEX)];
  };

  const guess = (): [CellData[], boolean] | undefined => {
    const guessedWord = board[currentRow].map(row => row.letter).join('').toLowerCase();
    if (isInvalid(guessedWord)) {
      return undefined;
    }
    return determineGuess(guessedWord);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const guessData = guess();
    if (!guessData) {
      return;
    }
    const [updatedCellData, isRightGuess] = guessData;
    let outcome = RoundOutcomeState.INDETERMINATE;
    if (isRightGuess) {
      outcome = RoundOutcomeState.WON;
    }
    if (currentRow === board.length - 1) {
      outcome = RoundOutcomeState.LOST;
    }
    await onRowSubmit(updatedCellData, outcome);
    if (outcome === RoundOutcomeState.INDETERMINATE) {
      // focus next row's first cell
      references && references[currentRow + 1] && references[currentRow + 1][0].current?.focus();
    }
  };

  return (<S.BoardContainer>
    <ToastMessage show={showToast} message={toastMessage} onClose={() => setShowToast(false)} />
    {board && references && <Grid
      board={board}
      references={references}
      currentRow={currentRow}
      onChange={onChange}
      onSubmit={onSubmit}
    />}
  </S.BoardContainer>);
};

export default Board;