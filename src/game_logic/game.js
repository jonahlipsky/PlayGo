import firebase from "firebase";
import { submitBoardPosition, applyNewBoardPosition, loadBoardPosition } from '../utilities/firebase_utils';
import Board from './board';

export function Game(){

  const board = new Board(19);
  board.render();

  let form = document.getElementById('game-selection-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let gameName = document.getElementById('game-name-input');
    let username = document.getElementById('username');

    if(gameName.value.length){
      initializeGame(gameName.value, username.value, board);
      let title = document.getElementById('title');
      let userPoints = document.getElementById('user-and-points-display');
      title.innerHTML = gameName.value;
      form.classList.add('hidden');
      title.classList.remove('hidden');
      userPoints.classList.remove('hidden');
    }
  });
}

function initializeGame(nameOfGame, username, board){
  //username currently is not being used

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

  let gameName = nameOfGame;
  let white = document.getElementById('white');
  let black = document.getElementById('black');
  black.innerHTML = `Black has captured ${board.blackPoints} stones`;
  white.innerHTML = `White has captured ${board.whitePoints} stones`;

 
  db.collection('games').doc(`${gameName}`).collection('boards')
    .orderBy('timestamp', 'desc')
    .limit(1).get().then( snapshot => {
      snapshot.docChanges().forEach( change => {
        applyNewBoardPosition.call(this, change.doc.data().gameBoard, board.grid);
      });
    });

  loadBoardPosition.call(this, board, gameName, username);
  const gameElement = document.getElementById("game-element");

  gameElement.addEventListener('click', function(e){
    const madeMove = board.moveEvent(e);
    if(madeMove){
      submitBoardPosition.call(this, board, gameName);
    }
  });
}