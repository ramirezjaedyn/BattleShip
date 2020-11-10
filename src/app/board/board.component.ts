import { Component, OnInit } from '@angular/core';
import { Board } from '../interfaces/board.interface';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  constructor() { }
  objectKeys = Object.keys;
  boardStatus: Board = 
  // 0: empty, 1: untouched ship, 2: miss, 3: hit, 4: sunk ship
    { //  1 2 3 4 5 6 7 8 9 10
      a: [0,0,0,0,0,0,0,0,0,0],
      b: [0,0,0,0,0,0,0,0,0,0],
      c: [0,0,0,0,0,0,0,0,0,0],
      d: [0,0,0,0,0,0,0,0,0,0],
      e: [0,0,0,0,0,0,0,0,0,0],
      f: [0,0,0,0,0,0,0,0,0,0],
      g: [0,0,0,0,0,0,0,0,0,0],
      h: [0,0,0,0,0,0,0,0,0,0],
      i: [0,0,0,0,0,0,0,0,0,0],
      j: [0,0,0,0,0,0,0,0,0,0]
    }
  
    showThing(row, col){
      this.boardStatus[row][col] = 2
      console.log(this.boardStatus)
    }
  ngOnInit(): void {
  }



}
