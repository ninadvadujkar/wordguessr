import { Form } from 'react-bootstrap';
import styled from 'styled-components';
import { LetterFoundState } from '../../enums/common.enums';

export const CellContainer = styled.div`
  position: relative;
  width: 100%;
  margin-right: 0.5rem;

  &::after {
    content: "";
    display: block;
    padding-top: 100%;
  }
`;

const defaultBackgroundColor = `#1a1a1c`;
const notFoundBackgroundColor = `#3a3a3c`;
const foundSameIndexBackgroundColor = `#538d4e`;
const foundNoSameIndexBackgroundColor = `#b59f3b`;

const determineCellBackgroundColor = (foundState: LetterFoundState) => {
  switch (foundState) {
    case LetterFoundState.INDETERMINATE:
      return defaultBackgroundColor;
    case LetterFoundState.NO:
      return notFoundBackgroundColor;
    case LetterFoundState.YES_SAME_INDEX:
      return foundSameIndexBackgroundColor;
    case LetterFoundState.YES_NO_SAME_INDEX:
      return foundNoSameIndexBackgroundColor;
  }
};

export const CellInput = styled(Form.Control)`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 0;
  font-size: 2rem;
  text-align: center;
  background-color: ${defaultBackgroundColor};
  color: #fff;
  &:focus {
    color: #fff;
    background-color: ${defaultBackgroundColor};
  }
  &:disabled {
    background-color: ${defaultBackgroundColor};
    cursor: not-allowed;
  }
  background-color: ${(props) => determineCellBackgroundColor(props.$foundState)} !important
`;
