import crossNode from './cross_node';

class Board{
  constructor(nCrosses){
    this.grid = this.gridSetup(nCrosses);
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
    return grid;
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