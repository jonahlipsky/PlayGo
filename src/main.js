import Stone from './game_logic/stone';
import Board from './game_logic/board';

document.addEventListener("DOMContentLoaded", () => {

  console.log("loadd-now");
  window.stone = Stone;
  window.board = Board;

});