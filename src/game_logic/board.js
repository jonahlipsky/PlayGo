import crossNode from './cross_node';
import { hasNullStone, isTaken } from '../utilities/board_utils';
//import a final liberty method


class Board{
  constructor(nCrosses){
    this.grid = this.gridSetup(nCrosses);
  }

  makeMove(color, coords){
    if(this.validMove(color, coords)){
      this.grid[coords[0]][coords[1]].assignStone(color);
      //put a taken check here
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
      return true;
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
}

export default Board;