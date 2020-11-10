import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Board } from '../interfaces/board.interface';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() isUserBoard: boolean;// tells the component whether it is the user or opponent's board

  // Different ships that the user can place or destroy on the board
  ships: Array<Object> = [{"destroyer": 2}, {"sub": 3}, {"cruiser":4}, {"battleship": 5}];

  constructor(private gameService: GameService, private auth: AngularFireAuth) { }


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
    // row and col spots correspondance
    this.boardStatus[row][col] = 2
    console.log(this.boardStatus)
  }

  ngOnInit(): void {
  }

  checkBoard(row, col) {
    // User's game board
    if(this.isUserBoard){
      this.checkUserBoard(row,col);
    }
    // Opponent's game board
    else {
      this.checkOppBoard(row, col);
    }
    
  }

  checkOppBoard(row, col) {
    // number currently on the spot that was clicked
    let clickedValue = this.boardStatus[row][col];
    console.log(clickedValue);
    
    // If clicked on the user's board and it IS a spot that has already been clicked on earlier...
    if(clickedValue === 2 || clickedValue === 3 || clickedValue === 4) {  
      // Let the user know that the spot they chose has already been clicked
      console.log("Can't click here");
    }
    if (clickedValue === 0){
      this.boardStatus[row][col] = 2
      console.log("User missed the shot!")
    }
    if (clickedValue === 1){
      this.boardStatus[row][col] = 3
      console.log("User hit the enemy ship!");
      // (MMP) RUN FUNC THAT CHECKS IF THE ENTIRETY OF A SHIP HAS BEEN DESTROYED
      // RUN FUNC THAT CHECKS IF GAME IS OVER 
    }
  }
  
  checkUserBoard(row, col) {
    let clickedValue = this.boardStatus[row][col];
    if(clickedValue === 0){
      console.log("so far so good");
      
      // So far so good
    }
    if(clickedValue === 1) {
      // can't click here
    }
  }


    // this.gameService.checkOppBoard(row, col); // WORK WITH JAEDYN TO CREATE METHOD IN THE SERVICE
  //   console.log(`Clicked spot ${row}, ${col + 1}`);
    
  // }


}
