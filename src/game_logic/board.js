import crossNode from './cross_node';
import { hasNullStone, gatherEnemyGroups, connectedNodesSetup, gatherSameColorGroups, nLibertiesInGroup } from '../utilities/board_utils';

class Board{
  constructor(nCrosses, gameType){
    this.whitePoints = 0;
    this.blackPoints = 0;
    this.color = 'black';
    this.grid = this.gridSetup(nCrosses);
    this.nCrosses = nCrosses;
    this.ip = 20; //inner padding for rendering
    this.scaleConstant = 40;

    this.initialBoardSetup();
    this.render();

    this.gameType = gameType;
    this.previousBoardKoCheck = null;
    this.playerName = null;
    this.player1 = null;
    this.player2 = null;
    this.previousMovePlayerName = null;
    this.oneMoveAgo = null;
    this.twoMovesAgo = null;
    this.moveEvent = this.moveEvent.bind(this);
  }

  initialBoardSetup(){
    this.gameElement = document.getElementById("game-element");
    this.ctx = this.gameElement.getContext('2d');
    this.ctx.translate(0, 760);
    this.ctx.scale(1, -1);
  }

  makeMove(color, coords){
    let targetNode = this.grid[coords[0]][coords[1]];
    switch(this.validMove(color,coords)){
      case true: 
        targetNode.assignStone(color);
        this.checkAdjacentEnemyGroups(targetNode);
        return true;
      case false:
        return false;
      default:
        return false;
    }
  }

  checkValidPlayer(){
    if(!this.player1 || !this.player2){
      return true;
    } else if(this.playerName === this.player1 || this.playerName === this.player2){
      return true;
    } else {
      return false;
    }
  }

  validMove(color, coords){
    //eventually add an option for ko as the first else if
    //add a case for not allowing suicidal moves
    let crossNode = this.grid[coords[0]][coords[1]];
    let connectedNodes = crossNode.connectedNodes;
    if(!this.checkValidPlayer()){
      return false;
    } else if(!(this.gameType === 'one-player') && this.playerName === this.previousMovePlayerName){
      return false;
    } else if(crossNode.stone){
      return false;
    } else if (this.checkIfMoveWouldTakeEnemy(crossNode, color)) {
      return true;
    } else if (connectedNodes.some(hasNullStone)){
      return true;
    } else if (this.checkIfWouldBeTaken(crossNode, color)){
      return false;
    } else {
      return true;
    }
  }

  checkIfMoveWouldTakeEnemy(node, makingMoveColor){
    let enemyColor = makingMoveColor === 'white' ? 'black' : 'white';
    let enemyGroups = gatherSameColorGroups(node, enemyColor);
    let moveWouldTakeEnemy = false;
    enemyGroups.forEach((group) => {
      if(nLibertiesInGroup(group) === 1){
        moveWouldTakeEnemy = true;
      }
    });
    return moveWouldTakeEnemy;
  }


  checkIfWouldBeTaken(crossNode, makingMoveColor){
    //handles the case where a move would be complete surrounded
    let enemyAdjacent = 0;
    crossNode.connectedNodes.forEach(node => {
      if (node.stone && node.stone.color != makingMoveColor){
        enemyAdjacent += 1;
      }
    });
    if(enemyAdjacent === crossNode.connectedNodes.length) return true;

    let friendlyGroups = gatherSameColorGroups(crossNode, makingMoveColor);
    //handles the case where every adjacent group of the same color has exactly one liberty. 
    if(friendlyGroups.every(group => {
      return nLibertiesInGroup(group) === 1;
    })){
      return true;
    } else {
      return false;
    }
  }

  checkAdjacentEnemyGroups(targetNode){
    let enemyGroups = gatherEnemyGroups(targetNode);
    let points = 0;
    enemyGroups.forEach(group => {
      if(nLibertiesInGroup(group) === 0){
        points += group.length;
        group.forEach(node => {
          node.stone = null;
        });
        this.updateTakenGroupAndNeighbors(group);
      }
    });
    this.awardPoints(points);
  }

  updateTakenGroupAndNeighbors(group){
    let alreadySeen = {};
    group.forEach(node => {
      node.updateSelf();
      alreadySeen[node.coords] = true;
      node.connectedNodes.forEach(adjacentNode => {
        if(!alreadySeen[adjacentNode.coords]){
          adjacentNode.updateSelf();
        }
      });
    });
  }

  awardPoints(points){
    if(this.color === "white"){
      this.whitePoints += points;
    } else {
      this.blackPoints += points;
    }
    if(this.gameType == 'one-player'){
      this.updateGamePoints();
    }
  }

  updateGamePoints(){
    let white = document.getElementById('white');
    let black = document.getElementById('black');
    black.innerHTML = this.blackPoints === 1 ? 
      `Black has captured 1 stone` : 
      `Black has captured ${this.blackPoints} stones`;
    white.innerHTML = this.whitePoints === 1 ? 
      `White has captured 1 stone`: 
      `White has captured ${this.whitePoints} stones`;
  }


  gridSetup(nCrosses){
    let grid = {};
    for (let i = 0; i < nCrosses; i++) {
      let column = {};
      for (let j = 0; j < nCrosses; j++) {
        column[j] = new crossNode([i, j]); // [x,y]
        let connectedNodes = connectedNodesSetup(i, j, nCrosses);
        column[j].connectedNodes = connectedNodes;
      }      
      grid[i] = column;
    }
    this.mapNodesToGridCoordinates(grid);
    return grid;
  }

  mapNodesToGridCoordinates(grid){
    let nCrosses = Object.keys(grid).length;
    for (let i = 0; i < nCrosses; i++) {
      for (let j = 0; j < nCrosses; j++) {
        let node = grid[i][j];
        let mappedNodesToCoords = [];
        node.connectedNodes.forEach(nodeCoordintes => {
          mappedNodesToCoords.push(grid[nodeCoordintes[0]][nodeCoordintes[1]]);
        });
        node.connectedNodes = mappedNodesToCoords;
      }      
    }
  }

  moveEvent(e){
    let x = e.offsetX - 20;
    let y = 740 - e.offsetY;
    let color = this.color;
    let xCoord = Math.floor((x + 20) / 40);
    let yCoord = Math.floor((y + 20) / 40);
    let coords = [xCoord, yCoord];
    let moveMade = this.makeMove(color,coords);
    this.render();
    if(moveMade && this.gameType != 'one-player'){
      this.color = this.color === 'black' ? 'white' : 'black';
      return coords;
    } else if(moveMade){
      this.color = this.color === 'black' ? 'white' : 'black';
      return null;
    } else {
      return null;
    }
  }

  renderMostRecentMove(coords){
    let ip = this.ip;
    let scale = this.scaleConstant;
    this.ctx.fillStyle = 'red';
    this.ctx.beginPath();
    this.ctx.arc(coords[0] * scale + ip, coords[1] * scale + ip, 3, 0, 2*Math.PI, true);
    this.ctx.fill();
  }

  render(){
    let ip = this.ip;
    let scale = this.scaleConstant;
    let boardSize = scale * this.nCrosses;
    let pieceRadius = Math.floor(((scale * 17) / 40));
    this.ctx.fillStyle = "#D5B077"; 
    this.ctx.fillRect(0,0,boardSize,boardSize); 
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'black';

    for (let y = ip; y <= boardSize; y += scale) {
      this.ctx.moveTo(ip, y);
      this.ctx.lineTo(boardSize - ip , y);
      this.ctx.stroke();        
    }

    for (let x = ip; x <= boardSize; x += scale) {      
      this.ctx.moveTo(x, ip);
      this.ctx.lineTo(x, boardSize - ip );
      this.ctx.stroke();        
    }

    let dotCoords = [3*scale + ip, 9*scale + ip, 15*scale + ip];

    this.ctx.fillStyle = 'black';
    for (let i = 0; i < dotCoords.length; i++) {
      for (let j = 0; j < dotCoords.length; j++) {
        this.ctx.beginPath();
        this.ctx.arc(dotCoords[i], dotCoords[j], Math.ceil(scale/8), 0, 2*Math.PI, true);
        this.ctx.fill();
      }
    }

    for (let x = 0; x < this.nCrosses; x++) {
      for (let y = 0; y < this.nCrosses; y++) {
        let node = this.grid[x][y];
        if(node.stone){
          this.ctx.fillStyle = node.stone.color;
          this.ctx.beginPath();
          this.ctx.arc(node.coords[0] * scale + ip, node.coords[1] * scale + ip, pieceRadius, 0, 2*Math.PI, true);
          this.ctx.fill();
        }
      }
    }
  }
}

export default Board;