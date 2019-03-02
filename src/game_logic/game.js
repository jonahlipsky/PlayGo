import firebase from "firebase/app";
import { submitBoardPosition, loadBoardPosition, 
  sendNewMessage, loadMessages, loadRecentGames } from '../utilities/firebase_utils';
import Board from './board';

export function Game(){
  var config = {
    apiKey: "AIzaSyB2XrtPKjoI9FEWJ5I4pWiFVAjV1j8S4AE",
    authDomain: "js-go-game.firebaseapp.com",
    databaseURL: "https://js-go-game.firebaseio.com",
    projectId: "js-go-game",
    storageBucket: "js-go-game.appspot.com",
    messagingSenderId: "949423767166"
  };
  
  firebase.initializeApp(config);
  const board = new Board(19);
  board.render();
  setModalListeners();
  setGameSelectionFormListener(board);
}

function setModalListeners(){
  
  document.getElementById('trigger-modal-button').addEventListener('click', () => {
    openModal();
  });

  let modalScreen = document.getElementById('modal-screen');

  modalScreen.addEventListener('click', () => {
    closeModal();
  });
}

function openModal(){
  let modal = document.getElementById('modal');
  modal.classList.remove('js-modal-close');
  modal.classList.add('js-modal-open');
  setTimeout(() => {
    document.getElementById('modal').classList.add('fade-in');
  }, 10);
}

function closeModal(){
  let modal = document.getElementById('modal')
  modal.classList.remove('fade-in');
  setTimeout(() => {
    modal.classList.remove('js-modal-open');
    modal.classList.add('js-modal-close');
  }, 700);

}

function setGameSelectionFormListener(board){
  let form = document.getElementById('game-selection-form');
  loadRecentGames();
  document.getElementById('modal-form').addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let gameName = document.getElementById('game-name-input').value;
    let username = document.getElementById('username').value;
    let gameType = document.getElementById('game-type').value;
    board.gameType = gameType;

    if(gameName.length && username.length){
      closeModal();
      initializeGame(gameName, username, board);
      let title = document.getElementById('title');
      let userPoints = document.getElementById('user-and-points-display');
      let learning = document.getElementById('learning');
      let recentGames = document.getElementById('recent-games-container');
      let openingInstructions = document.getElementById('opening-instructions');
      openingInstructions.classList.add('hidden');
      recentGames.classList.add('hidden');
      title.innerHTML = gameName + `: Hello, ${username}`;
      learning.classList.add('hidden');
      setTimeout(() => {
        form.classList.add('hidden');
      }, 1000);
      title.classList.remove('hidden');
      userPoints.classList.remove('hidden');
      if(gameType != 'one-player'){
        initializeChat(board.playerName, gameName);
      }
    }
  });
}


function initializeChat(playerName, gameName){
  let chatElement = document.getElementById('messages-container');
  chatElement.classList.remove('hidden');
  let messagesForm = document.getElementById('message-form');
  loadMessages.call(this, gameName);
  messagesForm.addEventListener('submit', e => {
    e.preventDefault();
    let messageElement = document.getElementById('message-body');
    if(messageElement.value.length){
      sendNewMessage.call(this, playerName, gameName, messageElement.value);
      messageElement.value = "";
    }
  });
}

function initializeGame(nameOfGame, username, board){

  let gameName = nameOfGame;
  let white = document.getElementById('white');
  let black = document.getElementById('black');
  black.innerHTML = `Black has captured ${board.blackPoints} stones`;
  white.innerHTML = `White has captured ${board.whitePoints} stones`;

  loadBoardPosition.call(this, board, gameName, username);
  const gameElement = document.getElementById("game-element");

  gameElement.addEventListener('click', function(e){
    const moveCoords = board.moveEvent(e);
    if(moveCoords){
      submitBoardPosition.call(this, board, gameName, moveCoords);
    }
  });
}