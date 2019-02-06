class stone{
  constructor(color = null, coord){
    this.color =  color;
    this.liberties = 0;
    // this.coordinate = coord; //[x,y] or [column_number, row_number]
  }
}

module.exports = stone;