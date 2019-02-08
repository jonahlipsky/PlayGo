import stone from './stone';

class crossNode{
  constructor(coords, board){ //coord: [x,y]
    this.coords = coords;
    this.connectedNodes = [];
    this.sameColorNodes = [];
    this.stone = null;
    this.board = board;
  }

  groupHasNoLiberties(coords){
    let previouslyChecked = [];
    let groupQueue = [this];
    let node;
    let targetNode = this.board.grid[coords[0]][coords[1]];
    while(groupQueue.length){
      debugger
      node = groupQueue.splice(0,1)[0];
      if(node.stone.liberties > 1){
        return false;
      } else if (node.stone.liberties === 1 && !node.connectedNodes.includes(targetNode)){
        return false;
      }
      this.sameColorNodes.forEach(node => {
        if(!previouslyChecked.includes(node)){
          groupQueue.push(node);
        }
      });
    }
    debugger
    return true;
  }

  updateLiberties(){
    if(this.stone){
      let liberties = 0;
      this.connectedNodes.forEach(node => {
        if(!node.stone){ 
          liberties += 1;
        }
      });
      this.stone.liberties = liberties;
    }

  }

  assignStone(color){
    if(!this.stone){
      this.stone = new stone(color);
      this.connectedNodes.forEach(node => {
        this.addSameColorNode(node);
      });
      this.updateLiberties();
      this.updateAdjacentLiberties();
    }
  }

  updateAdjacentLiberties(){
    this.connectedNodes.forEach(node => {
      if(node.stone){
        node.updateLiberties();
      }
    });
  }

  removeStone(){ 
    //this operates in a depth first manner traversing related same-color nodes
    // and reassigning their stones to null
    if(this.stone){
      this.stone = null;
      this.sameColorNodes.forEach((node) => {
        node.removeStone();
      });
      this.sameColorNodes = [];
    }
  }

  addSameColorNode(node){
    if(node.stone && node.stone.color === this.stone.color && 
      !this.sameColorNodes.includes(node)){
      this.sameColorNodes.push(node);
      node.sameColorNodes.push(this);
    }
  }

  removeSameColorNode(node){
    let index = this.sameColorNodes.indexOf(node);
    if(index != -1){
      this.sameColorNodes.splice(index, 1);
    }
  }
}

export default crossNode;