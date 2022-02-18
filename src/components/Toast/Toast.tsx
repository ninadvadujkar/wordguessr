import { Toast, ToastContainer } from 'react-bootstrap'
import * as S from './Toast.styles';

interface Props {
  show: boolean;
  message: string;
  onClose: () => void;
}

const ToastMessage: React.FC<Props> = ({ show, message, onClose }) => {
  return <ToastContainer position="middle-center" style={{ zIndex: 100 }}>
    <Toast onClose={onClose} show={show} delay={1000} autohide={true}>
      <Toast.Body>
        <S.Message>{message}</S.Message>
      </Toast.Body>
    </Toast>
  </ToastContainer>
};

export default ToastMessage;
