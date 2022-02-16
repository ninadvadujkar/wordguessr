import { Form } from 'react-bootstrap';
import styled from 'styled-components';

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

export const CellInput = styled(Form.Control)`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 0;
  font-size: 2rem;
  text-align: center;
  &:disabled {
    cursor: not-allowed;
  }
`;
