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

export const moveWouldTakeEnemyGroup = node => {

};




//write a final liberty method