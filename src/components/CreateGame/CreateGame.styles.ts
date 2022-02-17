import { Button as BootstrapButton, Form } from 'react-bootstrap';
import styled from 'styled-components';


export const FormContainer = styled.div`
  display: flex;
`;

export const Button = styled(BootstrapButton)`
  width: 100px;
`;

export const Control = styled(Form.Control)`
  width: 20rem;
`

export const Strong = styled.strong`
  color: #fff;
  display: inline-flex;
  margin-top: 1rem;
`;