import { Form as F } from 'react-bootstrap';
import styled from 'styled-components';

export const Form = styled(F)`
  position: relative;
`;

export const Row = styled.div`
  display: flex;
  flex-flow: row;
  margin-bottom: 0.5rem;
`

export const SubmitButton = styled.button`
  visibility: hidden;
  width: 0;
  height: 0;
  position: absolute;
  right: 0;
  top: 0;
`;
