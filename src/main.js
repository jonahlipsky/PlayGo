import Stone from './game_logic/stone';
import Board from './game_logic/board';
import firebase from "firebase";
// import { submitBoardPosition } from './utilities/firebase_utils';


document.addEventListener("DOMContentLoaded", () => {



  // Initialize Firebase
  // TODO: Replace with your project's customized code snippet
  var config = {
    apiKey: "AIzaSyB2XrtPKjoI9FEWJ5I4pWiFVAjV1j8S4AE",
    authDomain: "js-go-game.firebaseapp.com",
    databaseURL: "https://js-go-game.firebaseio.com",
    projectId: "js-go-game",
    storageBucket: "js-go-game.appspot.com",
    messagingSenderId: "949423767166"
  };
  firebase.initializeApp(config);
  var db = firebase.firestore();

  // const admin = require('firebase-admin');

  // const serviceAccount = require('../js-go-game-231200-5b0b44c39bd9.json');

  // admin.initializeApp({
  //   credential: admin.credential.cert(serviceAccount)
  // });

  // const db = admin.firestore();
  const board = new Board(19);
  loadBoardPosition(board);
  submitBoardPosition(board.grid);
  const gameElement = document.getElementById("game-element");
  gameElement.addEventListener('click', function(e){
    debugger
    const madeMove = board.moveEvent(e);
    if(madeMove){
      submitBoardPosition(board.grid);
    }
  });
  

  window.board = board;

});


function submitBoardPosition(grid){
  // Add a new message entry to the Firebase database.
  let newGrid = Object.assign({})
  let keys = Object.keys(grid);
  for (let x = 0; x < keys.length; x++) {
    for (let y = 0; y < keys.length; y++) {
      newGrid[x] = newGrid[x] || {};
      newGrid[x][y] = newGrid[x][y] || {};
      newGrid[x][y] = grid[x][y].stone ? grid[x][y].stone.color : null;
    }
  }
  return firebase.firestore().collection('games').add({
    gameBoard: newGrid,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(function(error) {
    console.error('Error writing new grid to database', error);
  });
};

function loadBoardPosition(board){
  const query = firebase.firestore()
                    .collection('games')
                    .orderBy('timestamp', 'desc')
                    .limit(1);
  query.onSnapshot(function(snapshot){
    snapshot.docChanges().forEach(function(change){
      debugger
      applyNewBoardPosition(change.doc.data().gameBoard, board);
    });
  });                    

}

function applyNewBoardPosition(newBoard, oldBoard){
  debugger
  for (let x = 0; x < Object.keys(oldBoard.nCrosses); x++) {
    for (let y = 0; y < oldBoard.nCrosses; y++) {
      // if(!(oldBoard.grid[x][y].stone === newBoard[x][y]) || 
      //   (!oldBoard.grid[x][y].stone && newBoard[x][y]) || 
      //   (oldBoard.grid[x][y].stone && !newBoard[x][y])
      //   )
      
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