import { Form } from 'react-bootstrap';
import { BoardData } from '../../types/common.types';
import Cell from '../Cell/Cell';
import * as S from './Grid.styles';

export interface GridProps {
  board: BoardData;
  currentRow: number;
  references?: React.RefObject<HTMLInputElement>[][]
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange?: (rowIndex: number, cellIndex: number, value: string, cellToFocus?: HTMLInputElement) => void;
}

const Grid: React.FC<GridProps> = ({ board, currentRow, references, onSubmit, onChange }) => {

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

  return (<div>
    {board.map((row, rowIndex) => {
      return <Form style={{ position: 'relative' }} key={rowIndex} onSubmit={(e) => onSubmit && onSubmit(e)}>
        <S.Row key={`row-${rowIndex}`}>
          {row.map((cell, cellIndex) => <Cell
            key={`cell-${rowIndex}-${cellIndex}`}
            ref={references && references[rowIndex][cellIndex]}
            cell={cell}
            disabled={rowIndex !== currentRow}
            onChange={(value) =>
              onChange && onChange(
                rowIndex,
                cellIndex,
                value,
                getCellRef(currentRow, cellIndex, value)
              )}
          />)}
        </S.Row>
        <S.SubmitButton type="submit" disabled={rowIndex !== currentRow} aria-hidden="true"></S.SubmitButton>
      </Form>;
    })}
  </div>);
};

export default Grid;