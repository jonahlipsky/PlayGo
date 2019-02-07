import crossNode from './cross_node';
import { hasNullStone, isTaken } from '../utilities/board_utils';
//import a final liberty method
const TAKEN = "TAKEN";


class Board{
  constructor(nCrosses){
    this.grid = this.gridSetup(nCrosses);
    this.nCrosses = nCrosses;
    this.render();
  }

  makeMove(color, coords){
    let targetNode = this.grid[coords[0]][coords[1]];
    switch(this.validMove(color,coords)){
      case true: 
        targetNode.assignStone(color);
      case false:
        console.log("invalid move");
      case TAKEN:
        targetNode.assignStone(color);
        targetNode.connectedNodes.forEach( node => {
          if(node.stone && node.stone.color != color && node.groupHasNoLiberties(coords)){
            node.removeStone();
          }
        });
      default:
        return null;
    }
  }

  validMove(color, coords){
    //eventually add an option for ko as the first else if
    //add a case for not allowing suicidal moves
    let crossNode = this.grid[coords[0]][coords[1]];
    if(crossNode.stone){
      return false;
    } else if (crossNode.connectedNodes.some(hasNullStone)){
      return true;
    } else if (crossNode.connectedNodes.some(isTaken(color, coords))){
      return TAKEN;
    }
  }

  gridSetup(nCrosses){
    let grid = {};
    for (let i = 0; i < nCrosses; i++) {
      let column = {};
      for (let j = 0; j < nCrosses; j++) {
        column[j] = new crossNode([i, j], this); // [x,y]
        let connectedNodes = this.connectedNodesSetup(i, j, nCrosses);
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

  connectedNodesSetup(i, j, nCrosses, grid){
    let up =    [i, j + 1];
    let right = [i + 1, j];
    let down =  [i, j - 1];
    let left =  [i - 1, j];

    let connectedNodes = [up, right, down, left];
    if (up[1] === nCrosses){
      delete connectedNodes[0];
    }
    if (right[0] === nCrosses){
      delete connectedNodes[1];
    }
    if(down[1] < 0){
      delete connectedNodes[2];
    }
    if(left[0] < 0){
      delete connectedNodes[3];
    }
    connectedNodes = connectedNodes.filter((node) => {
      return !!node;
    });

    return connectedNodes;
  }

  moveEvent(e){
    
    let x = e.clientX - e.currentTarget.offsetLeft;

    //use these to lock in the exact location. remove borders while getting formula exact
    console.log(`e.clientY ${e.clientY}`);
    console.log(`e.currentTarget.offsetTop ${e.currentTarget.offsetTop}`);
    console.log(`e.currentTarget.offsetHeight ${e.currentTarget.offsetHeight}`);
  }

  render(){
    let gameElement = document.getElementById("game-element");
    let ctx = gameElement.getContext('2d');
    let boardSize = 40 * this.nCrosses;
    let p = 0; //outer padding
    let ip = 20;
    ctx.translate(0, 760);
    ctx.scale(1, -1);
    ctx.fillStyle = "#D5B077"; 
    ctx.fillRect(0,0,boardSize,boardSize); 
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';

    for (let y = ip; y <= boardSize; y += 40) {
      ctx.moveTo(p + ip, p + y);
      ctx.lineTo(boardSize - ip , p + y);
      ctx.stroke();        
    }

    for (let x = ip; x <= boardSize; x += 40) {      
      ctx.moveTo(p + x, p + ip);
      ctx.lineTo(p + x, boardSize - ip );
      ctx.stroke();        
    }

    gameElement.addEventListener('click', this.moveEvent);

  }
}

export default Board;