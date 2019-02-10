import firebase from "firebase";

export function loadMessages(gameName){
  const query = firebase.firestore()
                    .collection('games').doc(`${gameName}`).collection('messages')
                    .orderBy('timestamp', 'desc')
                    .limit(10);

  let chatUl = document.getElementById('chat-ul');
  query.onSnapshot(function(snapshot){
    snapshot.docChanges().forEach(function(change){
      if(change.type === "added"){
        let data = change.doc.data();
        appendMessage(data, chatUl);
      }
    });
  });      
}


export function loadBoardPosition(board, gameName, username){
  const query = firebase.firestore()
                    .collection('games').doc(`${gameName}`).collection('boards')
                    .orderBy('timestamp', 'desc')
                    .limit(1);
  board.playerName = username;
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
        toggleYourTurn(data, board);
      }
    });
  });                    
}

export function sendNewMessage(playerName, gameName, message){
  let object = {
    playerName,
    message,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };
  return firebase.firestore().collection('games').doc(`${gameName}`).collection('messages').add(object)
    .catch(function(error) {
    console.error('Error writing new message to database', error);
  });
}

export function submitBoardPosition(board, gameName, coords){
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

  //initialize players one and two. 
  //board method #check valid player verifies using this info
  let player1 = board.player1 || board.playerName;
  let player2;
  if(board.player1){
    player2 = board.player2 || board.playerName;
  } else {
    player2 = null;
  }

  let object = {
    mostRecentPlayer: board.playerName,
    gameBoard: newGrid,
    color: board.color,
    blackPoints: board.blackPoints,
    whitePoints: board.whitePoints,
    playerOne: player1,
    playerTwo: player2,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    coords
  };
  return firebase.firestore().collection('games').doc(`${gameName}`).collection('boards').add(object)
    .catch(function(error) {
    console.error('Error writing new grid to database', error);
  });
};


export function restoreBoardPosition(data, oldBoard){
  console.log(data.color, data.blackPoints, data.whitePoints);
  oldBoard.color = data.color;
  oldBoard.whitePoints = data.whitePoints;
  oldBoard.blackPoints = data.blackPoints;
  oldBoard.player1 = data.playerOne;
  oldBoard.player2 = data.playerTwo;
  oldBoard.previousMovePlayerName = data.mostRecentPlayer;

  let white = document.getElementById('white');
  let black = document.getElementById('black');
  black.innerHTML = data.blackPoints === 1 ? 
    `Black has captured 1 stone` : 
    `Black has captured ${data.blackPoints} stones`
  white.innerHTML = data.whitePoints === 1 ? 
    `White has captured 1 stone`: 
    `White has captured ${data.whitePoints} stones`;

  applyNewBoardPosition(data, oldBoard);
}

//helper functions

function toggleYourTurn(data, board){
  let yourTurnElement = document.getElementById('your-turn');
  if(yourTurn(data,board)){
      yourTurnElement.classList.remove('hidden');
  } else {
    yourTurnElement.classList.add('hidden');
  }
}

function yourTurn(data, board){
  if((board.playerName === board.player1 || board.playerName === board.player2) &&
  data.mostRecentPlayer != board.playerName){
    return true;
  } else {
    return false;
  }
}

function appendMessage(data, chatUl){
  let message = data.playerName + ": " + data.message;
  let li = document.createElement("li");
  let textNode = document.createTextNode(message);
  li.appendChild(textNode);
  chatUl.insertBefore(li, chatUl.firstChild);
}


function applyNewBoardPosition(data, oldBoard){
  let newBoard = data.gameBoard;
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
  if(yourTurn(data, oldBoard)){
    oldBoard.renderMostRecentMove(data.coords);
  }
}
