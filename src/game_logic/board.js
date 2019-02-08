import crossNode from './cross_node';
import { hasNullStone, isTaken, onlyOneLibertyInGroup, 
  gatherEnemyGroups, connectedNodesSetup } from '../utilities/board_utils';
//import a final liberty method

class Board{
  constructor(nCrosses){
    this.grid = this.gridSetup(nCrosses);
    this.nCrosses = nCrosses;
    this.color = 'black';
    this.gameElement = document.getElementById("game-element");
    this.ctx = this.gameElement.getContext('2d');
    this.ctx.translate(0, 760);
    this.ctx.scale(1, -1);
    this.render();
    this.gameElement.addEventListener('click', this.moveEvent.bind(this));
    this.whitePoints = 0;
    this.blackPoints = 0;
  }

  makeMove(color, coords){
    let targetNode = this.grid[coords[0]][coords[1]];
    switch(this.validMove(color,coords)){
      case true: 
        targetNode.assignStone(color);
        this.checkAdjacentEnemyGroups(targetNode);
        return true;
      case false:
        console.log("invalid move");
        return false;
      default:
        console.log('error: did not hit any options in makeMove');
        return false;
    }
  }

  validMove(color, coords){
    //eventually add an option for ko as the first else if
    //add a case for not allowing suicidal moves
    let crossNode = this.grid[coords[0]][coords[1]];
    let connectedNodes = crossNode.connectedNodes;
    if(crossNode.stone){
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
    }
    return;
  }

  render(){

    let boardSize = 40 * this.nCrosses;
    let p = 0; //outer padding
    let ip = 20;
    this.ctx.fillStyle = "#D5B077"; 
    this.ctx.fillRect(0,0,boardSize,boardSize); 
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'black';

    for (let y = ip; y <= boardSize; y += 40) {
      this.ctx.moveTo(p + ip, p + y);
      this.ctx.lineTo(boardSize - ip , p + y);
      this.ctx.stroke();        
    }

    for (let x = ip; x <= boardSize; x += 40) {      
      this.ctx.moveTo(p + x, p + ip);
      this.ctx.lineTo(p + x, boardSize - ip );
      this.ctx.stroke();        
    }

    let dotCoords = [3*40 + ip, 9*40 + ip, 15*40 + ip];

    this.ctx.fillStyle = 'black';
    for (let i = 0; i < dotCoords.length; i++) {
      for (let j = 0; j < dotCoords.length; j++) {
        this.ctx.beginPath();
        this.ctx.arc(dotCoords[i], dotCoords[j], 5, 0, 2*Math.PI, true);
        this.ctx.fill();
      }
    }

    for (let x = 0; x < this.nCrosses; x++) {
      for (let y = 0; y < this.nCrosses; y++) {
        let node = this.grid[x][y];
        if(node.stone){
          this.ctx.fillStyle = node.stone.color;
          this.ctx.beginPath();
          this.ctx.arc(node.coords[0] * 40 + ip, node.coords[1] * 40 + ip, 17, 0, 2*Math.PI, true);
          this.ctx.fill();
        }
      }
    }
  }
}

export default Board;