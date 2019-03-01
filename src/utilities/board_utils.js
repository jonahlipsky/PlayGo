export const hasNullStone = (node) => {
  return !node.stone;
};

export function nLibertiesInGroup(group){
  console.log(group)
  debugger
  let n = 0;
  let previousLiberties = {};
  group.forEach(node => {
    if(node.stone.liberties){
      n += adjustLiberties(previousLiberties, node);
    }
  });
  debugger
  return n;
}

function adjustLiberties(previousLiberties, node){
  debugger
  let n = 0;
  node.connectedNodes.forEach(adjacentNode => {
    if(!adjacentNode.stone){
      n += 1;
      previousLiberties[adjacentNode.coords] = true;
    }
  });
  debugger
  return n;
}

export const gatherEnemyGroups = (targetNode) => {
  debugger
  let adjacentEnemyNodes = targetNode.oppositeColorNodes;
  let enemyGroups = [];
  for (let i = 0; i < adjacentEnemyNodes.length; i++) {
    let alreadyPresent = false;
    for (let j = 0; j < enemyGroups.length; j++) {
      if(enemyGroups[j].includes(adjacentEnemyNodes[i])){
        alreadyPresent = true;
      }
    }
    if(!alreadyPresent){
      let group = [];
      let queue = [adjacentEnemyNodes[i]];
      while(queue.length){
        group.push(queue[0]);
        queue[0].sameColorNodes.forEach(node => {
          if ( !group.includes(node) && !queue.includes(node) ) queue.push(node);
        });
        queue = queue.slice(1);
      }
      enemyGroups.push(group);
    }
  }
  return enemyGroups;
};

export const gatherSameColorGroups = (targetNode, color) => {
  debugger
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
  debugger
  return friendlyGroups;
};

export const connectedNodesSetup = (i, j, nCrosses) => {
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