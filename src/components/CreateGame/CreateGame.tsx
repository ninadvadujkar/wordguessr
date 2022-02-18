import { useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { answers } from '../../constants/words-dictionary';
import { randomNoRepeats } from '../../utils/common.utils';
import * as S from './CreateGame.styles';

const CreateGame = () => {
  const [noOfRounds, setNoOfRounds] = useState<number>();
  const [wordsToGuess, setWordsToGuess] = useState<string[]>();
  const [wordsHidden, setWordsHidden] = useState(true);
  const [gameUrl, setGameUrl] = useState<string>();
  const gameUrlEl = useRef<HTMLSpanElement>(null);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!noOfRounds) {
      alert('Please enter number of rounds');
      return;
    }
    const generate = randomNoRepeats(answers);
    const wordsToGuess = [];
    for (let i = 0; i < noOfRounds; i++) {
      wordsToGuess.push(generate());
    }
    setWordsToGuess(wordsToGuess);
    setWordsHidden(true);
    setGameUrl(`${window.location.origin}/game?gameId=${window.btoa(wordsToGuess.join(','))}`);
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
      <Form.Label>Looks like you'd like to challenge yourself or your friends to a game of Wordguessr! Enter the amount of rounds the game should have (between 1 - 10).</Form.Label>
      <S.FormContainer>
        <S.Control size="lg" type="number" placeholder="Number of rounds go here..." min={1} max={10} onChange={(event: any) => setNoOfRounds(event.target.value)} />
        <S.Button type="submit" variant="primary">Submit</S.Button>
      </S.FormContainer>
    </Form>
    {wordsToGuess && <S.Strong>Word(s) to guess: {
      wordsHidden ?
        wordsToGuess.map(word => word.replace(/\w/g, "*")).join(', ') : 
        wordsToGuess.join(', ')
      }</S.Strong>
    }
    {wordsToGuess && <Button type="button" variant="light" onClick={() => setWordsHidden(false)} style={{ marginLeft: '1rem' }}>Reveal words</Button>}
    <br />
    {gameUrl && <S.Strong>Game URL: &nbsp; <span ref={gameUrlEl}>{gameUrl}</span></S.Strong>}
    {gameUrl && <Button type="button" variant="light" onClick={copyToClipboard} style={{ marginLeft: '1rem ' }}>Copy to clipboard</Button>}
  </>);
};

export default CreateGame;