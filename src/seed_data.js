function seed_data(board){
  board.grid[3][3].assignStone('b');
  board.grid[3][4].assignStone('b');
  board.grid[3][5].assignStone('b');
}

module.exports = seed_data;