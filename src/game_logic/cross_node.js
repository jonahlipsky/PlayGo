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

  // removeStone(){ 
  //   //this operates in a depth first manner traversing related same-color nodes
  //   // and reassigning their stones to null
  //   debugger
  //   if(this.stone){
  //     this.stone = null;
  //     this.sameColorNodes.forEach((node) => {
  //       debugger;
  //       let thisIndex = node.sameColorNodes.indexOf(this);
  //       node.sameColorNodes.splice(thisIndex, 1);
  //       node.removeStone();
  //     });
  //     this.sameColorNodes = [];
  //   }
  // }


}

export default crossNode;