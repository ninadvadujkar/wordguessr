import { BoardData } from '../../types/common.types';
import Cell from '../Cell/Cell';
import * as S from './Board.styles';

interface Props {
  board: BoardData;
  currentRow: number;
  onChange: (rowIndex: number, cellIndex: number, value: string) => void;
}

const Board: React.FC<Props> = ({ board, currentRow, onChange }) => {

  const generate = () => {
    return board.map((row, rowIndex) => {
      return <S.Row key={`row-${rowIndex}`}>
        {row.map((cell, cellIndex) => <Cell
          key={`cell-${rowIndex}-${cellIndex}`}
          cell={cell}
          disabled={rowIndex !== currentRow}
          onChange={(value) => onChange(rowIndex, cellIndex, value)}
        />)}
      </S.Row>;
    });
  };

  return (<S.BoardContainer>
    {generate()}
  </S.BoardContainer>);
};

export default Board;