import React from 'react';
import { CellData } from '../../types/common.types';
import * as S from './Cell.styles';

export interface CellProps {
  cell: CellData;
  disabled: boolean;
  onChange: (letter: string) => void;
}

const Cell = React.forwardRef(({ cell, disabled, onChange }: CellProps, ref) => {
  return (<S.CellContainer>
    <S.CellInput ref={ref} type="text" aria-label='cell' maxLength={1} value={cell.letter} disabled={disabled} onChange={(event: React.ChangeEvent<any>) => onChange(event.target.value)} />
  </S.CellContainer>
  );
});

export default Cell;
