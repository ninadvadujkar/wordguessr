import { LetterFoundState, RoundOutcomeState } from '../enums/common.enums';

export interface CellData {
  letter: string;
  foundState: LetterFoundState;
}

export type BoardData = [
  [CellData, CellData, CellData, CellData, CellData],
  [CellData, CellData, CellData, CellData, CellData],
  [CellData, CellData, CellData, CellData, CellData],
  [CellData, CellData, CellData, CellData, CellData],
  [CellData, CellData, CellData, CellData, CellData],
  [CellData, CellData, CellData, CellData, CellData]
];

export interface Round {
  outcomeState: RoundOutcomeState;
  wordToGuess: string;
  board: BoardData;
  currentBoardRow: number;
}

export interface GameState {
  rounds: Round[];
  currentRoundIndex: number;
}

