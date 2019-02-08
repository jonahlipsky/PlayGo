export const hasNullStone = (node) => {
  return !node.stone;
};


export const isTaken = (color, coords) => {
  return node => {
    // debugger
    if(node.stone && node.stone.color != color){
      return node.groupHasNoLiberties(coords);
    } else {
      return false;
    }
  };
};

export const onlyOneLibertyInGroup = node => {
  //the first order stone can have one liberty,
  //but no subsequent connected stones can
  //for this to return true
  if (node.stone.liberties > 1){
    return false;
  }

  let queue = node.sameColorNodes;
  let previouslyChecked = [node];
  let checkNode;
  while (queue.length){
    checkNode = queue.splice(0,1)[0];
    if(checkNode.stone.liberties){
      return false;
    } else {
      previouslyChecked.push(checkNode);
      
      checkNode.sameColorNodes.forEach((sameColorNode) => {
        if(!previouslyChecked.includes(sameColorNode)){
          queue.push(sameColorNode);
        }
      });
    }

  }
  return true;
};

export const noLibertiesInGroup = node => {
  let queue = [node];
  let previouslyChecked = [];
  let checkNode;
  while (queue.length){
    checkNode = queue.splice(0,1)[0];
    if(checkNode.stone.liberties){
      return false;
    } else {
      previouslyChecked.push(checkNode);
      
      checkNode.sameColorNodes.forEach((sameColorNode) => {
        if(!previouslyChecked.includes(sameColorNode)){
          queue.push(sameColorNode);
        }
      });
    }

  }
  return true;

};



export const gatherEnemyGroups = (targetNode) => {
  let adjacentEnemyNodes = targetNode.oppositeColorNodes;
  let enemyGroups = [];
  adjacentEnemyNodes.forEach(enemyNode => {
    let group;
    if(!enemyGroups.length || enemyGroups.every(array => {
      return !array.includes(enemyNode);
    })){
      group = [enemyNode];
      let queue = enemyNode.sameColorNodes;
      while(queue.length){
        let nextNode = queue.splice(0,1)[0];
        if(!group.includes(nextNode)){
          group.push(nextNode);
        }
      }
    }
    enemyGroups.push(group);
  });
  return enemyGroups;
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


//write a final liberty method