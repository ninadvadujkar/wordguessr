import Grid, { GridProps } from '../Grid/Grid';
import * as S from './Summary.styles';

interface Props {
  boards: GridProps[];
}

const Summary: React.FC<Props> = ({ boards }) => {
  return (
    <S.SummaryContainer>
      {boards.map((board, index) => (<div key={`summary-round-${index}`}>
        <S.Title>Round {index + 1}</S.Title>
        <Grid {...board} />
      </div>))}
    </S.SummaryContainer>
  );
};

export default Summary;