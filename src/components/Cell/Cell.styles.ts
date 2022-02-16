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

const backgroundColor = `#1a1a1c`;

export const CellInput = styled(Form.Control)`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 0;
  font-size: 2rem;
  text-align: center;
  background-color: ${backgroundColor};
  color: #fff;
  &:focus {
    color: #fff;
    background-color: ${backgroundColor};
  }
  &:disabled {
    background-color: ${backgroundColor};
    cursor: not-allowed;
  }
`;
