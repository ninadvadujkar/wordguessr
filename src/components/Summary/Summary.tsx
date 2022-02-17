import { Round } from '../../types/common.types';
import Grid, { GridProps } from '../Grid/Grid';
import * as S from './Summary.styles';

interface Props {
  rounds: Round[];
}

const Summary: React.FC<Props> = ({ rounds }) => {
  return (
    <S.SummaryContainer>
      {rounds.map((round, index) => (<div key={`summary-round-${index}`}>
        <S.Title>Round {index + 1} (Correct Word: {round.wordToGuess}) (Outcome: {round.outcomeState})</S.Title>
        <Grid board={round.board} currentRow={round.currentBoardRow} />
      </div>))}
    </S.SummaryContainer>
  );
};

export default Summary;