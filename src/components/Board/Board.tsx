import React, { useState } from 'react';
import { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { BoardData } from '../../types/common.types';
import Cell from '../Cell/Cell';
import * as S from './Board.styles';

interface Props {
  board: BoardData;
  currentRow: number;
  onChange: (rowIndex: number, cellIndex: number, value: string, cellToFocus?: HTMLInputElement) => void;
  onRowSubmit: () => Promise<void>;
}

const Board: React.FC<Props> = ({ board, currentRow, onChange, onRowSubmit }) => {
  const [references, setReferences] = useState<React.RefObject<HTMLInputElement>[][]>();
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

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('on submit', event);
    await onRowSubmit();
    // focus next row's first cell
    references && references[currentRow + 1][0].current?.focus();
  };

  return (<S.BoardContainer>
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