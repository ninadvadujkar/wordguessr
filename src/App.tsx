import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import CreateGame from './components/CreateGame/CreateGame';
import Game from './components/Game/Game';
import NotFound from './components/NotFound/NotFound';
import './App.scss';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="create-game" element={<CreateGame />} />
          <Route path="game/:gameId" element={<Game />} />
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;
