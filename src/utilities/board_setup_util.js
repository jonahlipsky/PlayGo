import crossNode from '../game_logic/cross_node';

export const connectedNodesSetup = (i, j, nCrosses) => {
  //generate which directions there is a connected node
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


export function gridSetup(nCrosses){
  //generate a grid of a given length
  //add crossNode classes at each cross
  //generate their connected node coordinates
  //then map the actual nodes to those coordinates
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
  mapNodesToGridCoordinates(grid);
  return grid;
}

function mapNodesToGridCoordinates(grid){
  //take the coordinates that were generated from connectedNodesSetup
  //and alter the each nodes 'connectedNodes' to be the actual notes, 
  //not just the coordinates
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

export function generateSimpleGridRepresentation(grid){
  let newGrid = Object.assign({});
  let keys = Object.keys(grid);
  for (let x = 0; x < keys.length; x++) {
    for (let y = 0; y < keys.length; y++) {
      newGrid[x] = newGrid[x] || {};
      newGrid[x][y] = newGrid[x][y] || {};
      newGrid[x][y] = grid[x][y].stone ? grid[x][y].stone.color : null;
    }
  }
  return newGrid;
}

export function generateFullGrid(simpleGrid){
  //generate a grid with connected nodes
  //add stones at the given locations and update the stones
  let newGrid = gridSetup(Object.keys(simpleGrid).length);
  let keys = Object.keys(simpleGrid);
  for (let x = 0; x < keys.length; x++) {
    for (let y = 0; y < keys.length; y++) {
      if(simpleGrid[x][y]){
        newGrid[x][y].assignStone(simpleGrid[x][y]);
      }
    }
  }
  return newGrid;
}