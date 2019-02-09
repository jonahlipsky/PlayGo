import Stone from './game_logic/stone';
import Board from './game_logic/board';
import firebase from "firebase";
// import firebase-tools from 'firebase-tools'

// import { submitBoardPosition } from './utilities/firebase_utils';


document.addEventListener("DOMContentLoaded", () => {

  var config = {
    apiKey: "AIzaSyB2XrtPKjoI9FEWJ5I4pWiFVAjV1j8S4AE",
    authDomain: "js-go-game.firebaseapp.com",
    databaseURL: "https://js-go-game.firebaseio.com",
    projectId: "js-go-game",
    storageBucket: "js-go-game.appspot.com",
    messagingSenderId: "949423767166"
  };
  firebase.initializeApp(config);
  const db = firebase.firestore();

  let gameName = 'testgame1';
 


  const board = new Board(19);
  db.collection('games').doc(`${gameName}`).collection('boards')
    .orderBy('timestamp', 'desc')
    .limit(1).get().then( snapshot => {
      snapshot.docChanges().forEach( change => {
        applyNewBoardPosition(change.doc.data().gameBoard, board.grid);
      });
    });
  board.render();
  loadBoardPosition(board, gameName);
  const gameElement = document.getElementById("game-element");


  gameElement.addEventListener('click', function(e){
    const madeMove = board.moveEvent(e);
    if(madeMove){
      submitBoardPosition(board, gameName);
    }
  });



  
  window.board = board;
});


function submitBoardPosition(board, gameName){
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
    currentTurnColor: board.color,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };
  return firebase.firestore().collection('games').doc(`${gameName}`).collection('boards').add(object)
    .catch(function(error) {
    console.error('Error writing new grid to database', error);
  });
};

function loadBoardPosition(board, gameName){
  const query = firebase.firestore()
                    .collection('games').doc(`${gameName}`).collection('boards')
                    .orderBy('timestamp', 'desc')
                    .limit(1);
  query.onSnapshot(function(snapshot){
    // let newBoard = snapshot.docChanges()[0].doc.data();
    // let previousBoardKoCheck = snapshot.docChanges()[1].doc.data();

    snapshot.docChanges().forEach(function(change){
      let data = change.doc.data();
      console.log(`New color received: ${data.currentTurnColor}`);
      board.color = data.currentTurnColor;
      applyNewBoardPosition(data.gameBoard, board);
    });
  });                    
}

function applyNewBoardPosition(newBoard, oldBoard, color){
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