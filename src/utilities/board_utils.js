export const hasNullStone = (node) => {
  return !node.stone;
};


export const isTaken = (color, coords) => {
  return node => {
    if(node.stone && node.stone.color != color){
      return node.groupHasNoLiberties(coords);
    } else {
      return false;
    }
  };
};


//write a final liberty method