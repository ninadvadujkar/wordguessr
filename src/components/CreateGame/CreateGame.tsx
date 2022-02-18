import { useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { dictionary } from '../../constants/words-dictionary';
import { randomNoRepeats } from '../../utils/common.utils';
import * as S from './CreateGame.styles';

const CreateGame = () => {
  const [noOfRounds, setNoOfRounds] = useState<number>();
  const [wordsToGuess, setWordsToGuess] = useState<string[]>();
  const [gameUrl, setGameUrl] = useState<string>();
  const gameUrlEl = useRef<HTMLSpanElement>(null);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!noOfRounds) {
      alert('Please enter number of rounds');
      return;
    }
    const generate = randomNoRepeats(dictionary);
    const wordsToGuess = [];
    for (let i = 0; i < noOfRounds; i++) {
      wordsToGuess.push(generate());
    }
    setWordsToGuess(wordsToGuess);
    setGameUrl(`${window.location.origin}/wordguessr/game/${window.btoa(wordsToGuess.join(','))}`);
  };

  const copyToClipboard = () => {
    if (!gameUrlEl || !gameUrlEl.current) {
      return;
    }
    navigator.clipboard.writeText(gameUrlEl.current.innerText);
  };

  return (<>
    <h1>Create Game</h1>
    <Form onSubmit={onSubmit}>
      <Form.Label>Looks like you'd like to challenge your friends to a game of Wordguessr! Enter the amount of rounds you'd like your friend to play</Form.Label>
      <S.FormContainer>
        <S.Control size="lg" type="number" placeholder="Number of rounds go here..." min={1} onChange={(event: any) => setNoOfRounds(event.target.value)} />
        <S.Button type="submit" variant="primary">Submit</S.Button>
      </S.FormContainer>
    </Form>
    {wordsToGuess && <S.Strong>Words your friends will be guessing: {wordsToGuess.join(', ')}</S.Strong>}
    <br />
    {gameUrl && <S.Strong>Game URL: &nbsp; <span ref={gameUrlEl}>{gameUrl}</span></S.Strong>}
    {gameUrl && <Button type="button" variant="light" onClick={copyToClipboard}>Copy to clipboard</Button>}
  </>);
};

export default CreateGame;