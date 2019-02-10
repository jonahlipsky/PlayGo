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

}

export default crossNode;