import React, { useState } from 'react';
import { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { BoardData, CellData } from '../../types/common.types';
import Cell from '../Cell/Cell';
import ToastMessage from '../Toast/Toast';
import { dictionary } from '../../words-dictionary';
import * as S from './Board.styles';
import { LetterFoundState } from '../../enums/common.enums';
import { createHashOfIndexes } from '../../utils/common.utils';

interface Props {
  board: BoardData;
  wordToGuess: string;
  currentRow: number;
  onChange: (rowIndex: number, cellIndex: number, value: string, cellToFocus?: HTMLInputElement) => void;
  onRowSubmit: (updatedRow: CellData[]) => Promise<void>;
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

  const getCellRef = (currentRow: number, cellIndex: number, value: string) => {
    if (!references) {
      return;
    }
    if (value && cellIndex !== 4) {
      return references[currentRow][cellIndex + 1].current as HTMLInputElement;
    }
    if (!value && cellIndex !== 0) {
      return references[currentRow][cellIndex - 1].current as HTMLInputElement;
    }
    return undefined;
  };

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

  const determineGuess = (guessedWord: string): CellData[] => {
    if (wordToGuess === guessedWord) {
      return guessedWord.split('').map(letter => ({ letter: letter.toUpperCase(), foundState: LetterFoundState.YES_SAME_INDEX }));
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
    return updatedRow;
  };

  const guess = (): CellData[] | undefined => {
    const guessedWord = board[currentRow].map(row => row.letter).join('').toLowerCase();
    if (isInvalid(guessedWord)) {
      return undefined;
    }
    return determineGuess(guessedWord);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('on submit', event);
    const updatedCellData = guess();
    if (!updatedCellData) {
      return;
    }
    await onRowSubmit(updatedCellData);
    // focus next row's first cell
    references && references[currentRow + 1][0].current?.focus();
  };

  return (<S.BoardContainer>
    <ToastMessage show={showToast} message={toastMessage} onClose={() => setShowToast(false)} />
    {board && references && board.map((row, rowIndex) => {
      return <Form key={rowIndex} onSubmit={onSubmit}>
        <S.Row key={`row-${rowIndex}`}>
          {row.map((cell, cellIndex) => <Cell
            key={`cell-${rowIndex}-${cellIndex}`}
            ref={references[rowIndex][cellIndex]}
            cell={cell}
            disabled={rowIndex !== currentRow}
            onChange={(value) =>
              onChange(
                rowIndex,
                cellIndex,
                value,
                getCellRef(currentRow, cellIndex, value)
              )}
          />)}
        </S.Row>
        <button type="submit" hidden disabled={rowIndex !== currentRow} aria-hidden="true"></button>
      </Form>;
    })}
  </S.BoardContainer>);
};

export default Board;