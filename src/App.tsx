import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import CreateGame from './components/CreateGame/CreateGame';
import Game from './components/Game/Game';
import NotFound from './components/NotFound/NotFound';
import './App.scss';
import * as S from './App.styles';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <S.Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="create-game" element={<CreateGame />} />
          <Route path="game/:gameId" element={<Game />} />
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </S.Container>
    </BrowserRouter>
  );
};

export default App;
