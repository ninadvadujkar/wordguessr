import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import * as S from './Home.styles';

const Home = () => {
  const [gameId, setGameId] = useState('');
  const navigate = useNavigate();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!gameId) {
      alert('Please enter a game id');
      return;
    }
    navigate(`/game/${gameId}`);
  };

  return (<>
    <h1>Welcome to this awesome game!</h1>
    <Form onSubmit={onSubmit}>
      <Form.Label>Did your friend share a game id with you? Then enter that here and enjoy the challenge! Want to challenge a friend then <Link to={'create-game'}>create a game</Link></Form.Label>
      <S.FormContainer>
        <Form.Control size="lg" type="text" placeholder="Your game id goes here..." onChange={(event) => setGameId(event.target.value)} />
        <S.Button type="submit" variant="dark">Submit</S.Button>
      </S.FormContainer>
    </Form>
  </>);
};

export default Home;
