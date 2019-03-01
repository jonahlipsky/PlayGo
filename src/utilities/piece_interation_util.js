import { generateFullGrid } from './board_setup_util';

export const hasNullStone = (node) => {
  return !node.stone;
};

export function nLibertiesInGroup(group){
  let n = 0;
  let previousLiberties = {};
  group.forEach(node => {
    if(node.stone.liberties){
      n += adjustLiberties(previousLiberties, node);
    }
  });
  return n;
}

function adjustLiberties(previousLiberties, node){
  let n = 0;
  node.connectedNodes.forEach(adjacentNode => {
    if(!adjacentNode.stone && !previousLiberties[adjacentNode.coords]){
      n += 1;
      previousLiberties[adjacentNode.coords] = true;
    }
  });
  return n;
}

export const gatherGroups = (targetNode, color) => {
  let adjacentFriendlyNodes = targetNode.connectedNodes.filter(node => {
    return node.stone && node.stone.color === color;
  });

  let friendlyGroups = [];
  for (let i = 0; i < adjacentFriendlyNodes.length; i++) {
    let alreadyPresent = false;
    for (let j = 0; j < friendlyGroups.length; j++) {
      if(friendlyGroups[j].includes(adjacentFriendlyNodes[i])){
        alreadyPresent = true;
      }
    }
    if(!alreadyPresent){
      let group = [];
      let queue = [adjacentFriendlyNodes[i]];
      while(queue.length){
        group.push(queue[0]);
        queue[0].sameColorNodes.forEach(node => {
          if ( !group.includes(node) && !queue.includes(node) ) queue.push(node);
        });
        queue = queue.slice(1);
      }
      friendlyGroups.push(group);
    }
  }
  return friendlyGroups;
};


function updateTakenGroupAndNeighbors(group){
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

export function checkAdjacentEnemyGroups(targetNode){
  let color = targetNode.stone.color === "white" ? "black" : "white";
  let enemyGroups = gatherGroups(targetNode, color);
  // let enemyGroups = gatherEnemyGroups(targetNode);
  let points = 0;
  enemyGroups.forEach(group => {
    if(nLibertiesInGroup(group) === 0){
      points += group.length;
      group.forEach(node => {
        node.stone = null;
      });
      updateTakenGroupAndNeighbors(group);
    }
  });
  this.awardPoints(points);
}


export function checkIfWouldBeTaken(crossNode, makingMoveColor){
  //handles the case where a move would be complete surrounded
  let enemyAdjacent = 0;
  crossNode.connectedNodes.forEach(node => {
    if (node.stone && node.stone.color != makingMoveColor){
      enemyAdjacent += 1;
    }
  });
  if(enemyAdjacent === crossNode.connectedNodes.length) return true;

  let friendlyGroups = gatherGroups(crossNode, makingMoveColor);
  //handles the case where every adjacent group of the same color has exactly one liberty. 
  if(friendlyGroups.every(group => {
    return nLibertiesInGroup(group) === 1;
  })){
    return true;
  } else {
    return false;
  }
}


export function checkIfMoveWouldTakeEnemy(node, makingMoveColor){
  let enemyColor = makingMoveColor === 'white' ? 'black' : 'white';
  let enemyGroups = gatherGroups(node, enemyColor);
  let moveWouldTakeEnemy = false;
  enemyGroups.forEach((group) => {
    if(nLibertiesInGroup(group) === 1){
      moveWouldTakeEnemy = true;
    }
  });
  return moveWouldTakeEnemy;
}

export function koCheck(color, coords){
  let previousBoard;
  let enemyColor;
  if(color === "white"){
    enemyColor = "black";
    previousBoard = this.previousWhiteBoard;
  } else {
    enemyColor = "white";
    previousBoard = this.previousBlackBoard;
  }
  if(previousBoard){
    let previousFullGrid = generateFullGrid(previousBoard);
    let previousNode = previousFullGrid[coords[0]][coords[1]];

    //if there was a piece of the same color at the previous board with no same color stones
    if(previousNode.stone && previousNode.stone.color === color && !previousNode.sameColorNodes.length){
      let currentNode = this.grid[coords[0]][coords[1]];
      let enemyGroups = gatherGroups(currentNode, enemyColor);

      //if there isn't one there now
      //and if exactly one enemy group of size one has exactly one liberty
      if(!currentNode.stone && exactlyOne(enemyGroups)){
        return true;
      }
    }
  }
  return false;
}

function exactlyOne(groups){
  //if exactly one group of size one has exactly one liberty
  let oneLiberty = groups.filter( group => {
    return nLibertiesInGroup(group) === 1;
  });

  if(oneLiberty.length === 1 && oneLiberty[0].length === 1){
    return true;
  } else {
    return false;
  }
}