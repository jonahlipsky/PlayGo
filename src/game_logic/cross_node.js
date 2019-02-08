import stone from './stone';

class crossNode{
  constructor(coords, board){ //coord: [x,y]
    this.coords = coords;
    this.connectedNodes = [];
    this.sameColorNodes = [];
    this.oppositeColorNodes = [];
    this.stone = null;
    this.board = board;
  }

  // groupHasNoLiberties(coords){
  //   let previouslyChecked = [];
  //   let groupQueue = [this];
  //   let node;
  //   let targetNode = this.board.grid[coords[0]][coords[1]];
  //   while(groupQueue.length){
  //     debugger
  //     node = groupQueue.splice(0,1)[0];
  //     if(node.stone.liberties > 1){
  //       return false;
  //     } else if (node.stone.liberties === 1 && !node.connectedNodes.includes(targetNode)){
  //       return false;
  //     }
  //     this.sameColorNodes.forEach(node => {
  //       if(!previouslyChecked.includes(node)){
  //         groupQueue.push(node);
  //       }
  //     });
  //   }
  //   debugger
  //   return true;
  // }

  assignStone(color){
    this.stone = new stone(color);
    this.updateSelf();
    this.connectedNodes.forEach(node => {
      node.updateSelf();
    });
  }


  updateSelf(){
    let liberties = this.stone ? this.connectedNodes.length : null;
    let sameColor = [];
    let oppositeColor = [];
    if(this.stone){
      this.connectedNodes.forEach(node => {
        if(node.stone){
          liberties -= 1;
          if(node.stone.color === this.stone.color){
            sameColor.push(node);
          } else {
            oppositeColor.push(node);
          }
        }
      });
      this.stone.liberties = liberties;
    } 
    
    this.sameColorNodes = sameColor;
    this.oppositeColorNodes = oppositeColor;
  }

  removeStone(){ 
    //this operates in a depth first manner traversing related same-color nodes
    // and reassigning their stones to null
    debugger
    if(this.stone){
      this.stone = null;
      this.sameColorNodes.forEach((node) => {
        debugger;
        let thisIndex = node.sameColorNodes.indexOf(this);
        node.sameColorNodes.splice(thisIndex, 1);
        node.removeStone();
      });
      this.sameColorNodes = [];
    }
  }


  // removeSameColorNode(node){
  //   let index = this.sameColorNodes.indexOf(node);
  //   if(index != -1){
  //     this.sameColorNodes.splice(index, 1);
  //   }
  // }
}

export default crossNode;