import { Button as BootstrapButton, Form } from 'react-bootstrap';
import styled from 'styled-components';


export const FormContainer = styled.div`
  margin-top: 1rem;
  display: flex;
`;

export const Button = styled(BootstrapButton)`
  max-width: 100px;
`;

export const Control = styled(Form.Control)`
  max-width: 20rem;
`

export const Strong = styled.strong`
  color: #fff;
  display: inline-flex;
  margin-top: 1rem;
`;