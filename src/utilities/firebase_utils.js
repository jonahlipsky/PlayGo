import firebase from "firebase";

export function submitBoardPosition(board, gameName){
  // Add a new message entry to the Firebase database.
  let grid = board.grid;
  let newGrid = Object.assign({});
  let keys = Object.keys(grid);
  for (let x = 0; x < keys.length; x++) {
    for (let y = 0; y < keys.length; y++) {
      newGrid[x] = newGrid[x] || {};
      newGrid[x][y] = newGrid[x][y] || {};
      newGrid[x][y] = grid[x][y].stone ? grid[x][y].stone.color : null;
    }
  }
  board.previousBoardKoCheck = newGrid;
  let object = {
    gameBoard: newGrid,
    color: board.color,
    blackPoints: board.blackPoints,
    whitePoints: board.whitePoints,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };
  return firebase.firestore().collection('games').doc(`${gameName}`).collection('boards').add(object)
    .catch(function(error) {
    console.error('Error writing new grid to database', error);
  });
};

export function loadBoardPosition(board, gameName){
  const query = firebase.firestore()
                    .collection('games').doc(`${gameName}`).collection('boards')
                    .orderBy('timestamp', 'desc')
                    .limit(1);
  query.onSnapshot(function(snapshot){
    // let docChanges = snapshot.docChanges()[0].doc.data();
    // let previousBoardKoCheck = snapshot.docChanges()[1].doc.data();
    //for some reason when I set it to limit(2), sometimes it returns one. Is that because
    //there is only one 'change'?
    //I think that this could certainly be it... In other words, it fires, the query, 
    //but then it gets only the 'changes', which would only ever be one board.

    snapshot.docChanges().forEach(function(change){
      if(change.type === "added"){
        let data = change.doc.data();
        restoreBoardPosition(data, board);
      }
    });
  });                    
}

export function applyNewBoardPosition(newBoard, oldBoard){
  for (let x = 0; x < oldBoard.nCrosses; x++) {
    for (let y = 0; y < oldBoard.nCrosses; y++) {
      let oldNode = oldBoard.grid[x][y];
      let newStoneValue = newBoard[x][y];
      if(!(oldNode.stone === newStoneValue)) { // this means they are not both null
        if(oldNode.stone && !newStoneValue){ // previously was a stone, now its not
          oldNode.stone = null;
          oldNode.updateSelf();
        } else if (!oldNode.stone && newStoneValue){ // previously wasn't a stone, now it is
          oldNode.assignStone(newStoneValue);
        }
      }
      oldBoard.render();
    }
  }
}

export function restoreBoardPosition(data, oldBoard){
  console.log(data.color, data.blackPoints, data.whitePoints);
  oldBoard.color = data.color;
  oldBoard.whitePoints = data.whitePoints;
  oldBoard.blackPoints = data.blackPoints;
  applyNewBoardPosition(data.gameBoard, oldBoard);
}