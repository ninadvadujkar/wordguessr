import React, { useState } from 'react';
import { useEffect } from 'react';
import { BoardData } from '../../types/common.types';
import Cell from '../Cell/Cell';
import * as S from './Board.styles';

interface Props {
  board: BoardData;
  currentRow: number;
  onChange: (rowIndex: number, cellIndex: number, value: string, cellToFocus?: HTMLInputElement) => void;
}

const Board: React.FC<Props> = ({ board, currentRow, onChange }) => {
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

  return (<S.BoardContainer>
    {board && references && board.map((row, rowIndex) => {
      return <S.Row key={`row-${rowIndex}`}>
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
      </S.Row>;
    })}
  </S.BoardContainer>);
};

export default Board;