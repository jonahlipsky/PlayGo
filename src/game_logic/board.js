import crossNode from './cross_node';
import { hasNullStone, onlyOneLibertyInGroup, 
  gatherEnemyGroups, connectedNodesSetup } from '../utilities/board_utils';

class Board{
  constructor(nCrosses){
    this.whitePoints = 0;
    this.blackPoints = 0;
    this.color = 'black';
    this.grid = this.gridSetup(nCrosses);
    this.nCrosses = nCrosses;
    this.ip = 20; //inner padding for rendering
    this.scaleConstant = 40;

    this.initialBoardSetup();
    this.render();

    this.previousBoardKoCheck = null;
    this.playerName = null;
    this.player1 = null;
    this.player2 = null;
    this.previousMovePlayerName = null;
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
        console.log('error: did not hit any options in makeMove');
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
    } else if(this.playerName === this.previousMovePlayerName){
      return false;
    } else if(crossNode.stone){
      return false;
    } else if (this.checkIfMoveWouldTakeEnemy(crossNode, color)) {
      return true;
    } else if (connectedNodes.some(hasNullStone)){
      return true;
    } else if (connectedNodes.every(this.checkIfWouldBeTaken(color, coords))){
      return false;
    } else {
      return true;
    }
  }

  checkAdjacentEnemyGroups(targetNode){
    let enemyGroups = gatherEnemyGroups(targetNode);
    const reducer = (accumulator, node) => accumulator + node.stone.liberties;
    let points = 0;
    enemyGroups.forEach(group => {
      if(!group.reduce(reducer, 0)){
        points += group.length;
        group.forEach(node => {
          node.stone = null;
          node.updateSelf();
        });
      }
    });

    this.awardPoints(points);
  }

  awardPoints(points){
    if(this.color === "white"){
      this.whitePoints += points;
    } else {
      this.blackPoints += points;
    }
  }


  checkIfMoveWouldTakeEnemy(node, makingMoveColor){
    let moveWouldTakeEnemy = false;
    node.connectedNodes.forEach((connectedNode) => {
      if(connectedNode.stone && connectedNode.stone.color != makingMoveColor && 
        onlyOneLibertyInGroup(connectedNode)){
        moveWouldTakeEnemy = true;
      }
    });
    return moveWouldTakeEnemy;
  }

  checkIfWouldBeTaken(makingMoveColor){
    return node => {
      if(node.stone.color != makingMoveColor){
        return true;
      } else if(onlyOneLibertyInGroup(node)){
        return true;
      }
    };
  }

  gridSetup(nCrosses){
    let grid = {};
    for (let i = 0; i < nCrosses; i++) {
      let column = {};
      for (let j = 0; j < nCrosses; j++) {
        column[j] = new crossNode([i, j], this); // [x,y]
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
    if(moveMade){
      this.color = this.color === 'black' ? 'white' : 'black';
      return coords;
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