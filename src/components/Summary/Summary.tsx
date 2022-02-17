import Grid, { GridProps } from '../Grid/Grid';
import * as S from './Summary.styles';

interface Props {
  boards: GridProps[];
}

const Summary: React.FC<Props> = ({ boards }) => {
  return (
    <div>
      {boards.map((board, index) => (<>
        <S.Title>Round {index + 1}</S.Title>
        <Grid {...board} />
      </>))}
    </div>
  );
};

export default Summary;