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
    console.log(queue)
    debugger
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




//write a final liberty method