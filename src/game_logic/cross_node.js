import stone from './stone';

class crossNode{
  constructor(coord, board){ //coord: [x,y]
    this.coord = coord;
    this.connectedNodes = [];
    this.sameColorNodes = [];
    this.stone = null;
    this.board = board;
  }

  assignStone(color){
    if(!this.stone){
      this.stone = new stone(color);
      this.connectedNodes.forEach(coord => {
        let node = this.board.grid[coord[0]][coord[1]];
        this.addSameColorNode(node);
      });
    }
  }

  removeStone(){ 
    //this operates in a depth first manner traversing related same-color nodes
    // and reassigning their stones to null
    if(this.stone){
      this.stone = null;
      let subsequentStonesRemoved = 0;
      this.sameColorNodes.forEach((node) => {
        subsequentStonesRemoved += node.removeStone();
      });
      this.sameColorNodes = [];
      return subsequentStonesRemoved + 1;
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

function reduceByOne(total = 4, node){
  if(node.stone){
    return total - 1;
  }
}

export default crossNode;