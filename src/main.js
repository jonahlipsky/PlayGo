import Stone from './game_logic/stone';
import Board from './game_logic/board';

document.addEventListener("DOMContentLoaded", () => {

  console.log("loadd-now");
  // window.stone = Stone;
  window.board = new Board(19);
  let board = window.board;
  board.grid[0][0].assignStone('b');
  board.grid[1][1].assignStone('b');
  board.grid[2][0].assignStone('b');
  board.grid[3][0].assignStone('w');
  board.grid[2][1].assignStone('w');
  board.validMove('w',[1,0])
});
