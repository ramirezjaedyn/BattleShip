import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Board } from '../interfaces/board.interface';
import { Ship } from '../interfaces/ship.interface';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() isUserBoard: boolean;// tells the component whether it is the user or opponent's board

  // Different ships that the user can place or destroy on the board
  shipsRemaining: Array<Ship> = [
    { name: "destroyer", length: 2 },
    { name: "submarine", length: 3 },
    { name: "battleship", length: 4 },
    { name: "carrier", length: 5 },
  ];

  coords: Array<Array<any>> = []

  selectedShip: Ship = this.shipsRemaining[0]; // will be the most recent ship clicked on by the user

  objectKeys = Object.keys;
  boardStatus: Board =
    // 0: empty, 1: untouched ship, 2: miss, 3: hit, 4: sunk ship
    { //  1 2 3 4 5 6 7 8 9 10
      0: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  rows = ['a', 'b', 'c', 'd','e', 'f', 'g', 'h', 'i', 'j']
  boardValue: number; // number 0-4 that will tell the template which background color to choose

  isVertical: string = "false"; // will be used to determine whether a ship is placed horizontal or vertical
  boxColor: string; // the color that the boxes will change to on the board

  constructor(private gameService: GameService, private auth: AngularFireAuth) { }


  showThing(row, col) {
    // row and col spots correspondance
    this.boardStatus[row][col] = 2
    console.log(this.boardStatus)
  }

  ngOnInit(): void {
  }

  checkBoard(row, col) {
    // User's game board
    if (this.isUserBoard) {
      this.checkUserBoard(row, col);
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
    if (clickedValue === 2 || clickedValue === 3 || clickedValue === 4) {
      // Let the user know that the spot they chose has already been clicked
      console.log("Can't click here");
    }
    if (clickedValue === 0) {
      this.boardStatus[row][col] = 2
      console.log("User missed the shot!")
    }
    if (clickedValue === 1) {
      this.boardStatus[row][col] = 3
      console.log("User hit the enemy ship!");
      // (MMP) RUN FUNC THAT CHECKS IF THE ENTIRETY OF A SHIP HAS BEEN DESTROYED
      // RUN FUNC THAT CHECKS IF GAME IS OVER 
    }
  }

  checkUserBoard(row, col) {
    let clickedValue = this.boardStatus[row][col];
    if (clickedValue === 0) {
      console.log("so far so good");

      // So far so good
    }
    if (clickedValue === 1) {
      // can't click here
    }
  }


  markCoords(val){
    this.coords.forEach(c =>{
      this.boardStatus[c[0]][c[1]] = val;
    })
    if(val === 1){
      this.coords = [];
      this.shipsRemaining.shift();
      // if there are ships then
      this.selectedShip = this.shipsRemaining[0]
      // otherwise mark them as ready to go
    }
  }
  // this.gameService.checkOppBoard(row, col); // WORK WITH JAEDYN TO CREATE METHOD IN THE SERVICE


// OBSOLETE FOR THE TIME BEING.. BRING BACK LATER.  WAS GETTING CALLED IN [STYLE]
  // getBGColor(row, col) { // NEED TO TAKE INTO ACCOUNT WHICH BOARD WE ARE SHOWING
  //   let clickedValue = this.boardStatus[row][col];
  //   if (clickedValue === 0) {
  //     return "blue";
  //   }
  //   if (clickedValue === 1) {
  //     return "gray";
  //   }
  //   if (clickedValue === 2) {
  //     return "black";
  //   }
  //   if (clickedValue === 3) {
  //     return "red";
  //   }
  // }

  shipPlacement(row, col, set) {
    this.markCoords(0)
    if (this.boardStatus[row][col] === 0 || this.boardStatus[row][col] === 5) {
      // we want the selected value to be a light gray

      this.coords = []
      // Horizontal ships
      if (this.isVertical == 'false') {
        for (let i = col; i < col+this.selectedShip.length; i++) {
          if(this.boardStatus[row][i] === 0 || this.boardStatus[row][i] === 5){
            this.coords.push([row, i])
          }
          else{
            this.coords = []
            break;
          }
        }
        
      }
      // Vertical ships
      else{
        for (let i = parseInt(row); i < (parseInt(row) + this.selectedShip.length); i++) {
          if( i <= 9 && (this.boardStatus[i][col] === 0 || this.boardStatus[i][col] === 5)){
            this.coords.push([i, col])
          }
          else{
            this.coords = [];
            break;
          }
        }

      }
      this.markCoords(set ? 1: 5)
      //console.log(row, col);
    }


    // change the css font to bold on the text of the ship 'clicked'

    // determine which spots the ship would occupy based off of orientation && length
    // if it is horizontal, loop through in that same row

    // if is vertical, loop through keys in the same col 

    // based off of the possible spots, when user hovers mouse, change the other possible spots' colors as well

  }

  // While the ship is selected and the user is trying to place a ship...
  //shipOrientation()
  // If a ship is selected (button clicked on template), check the horiz/vert status and run the func as you hover

  // wait for click to try to place ship... if all 0's, let it place, otherwise don't allow
  guessShot(row, col) {
    console.log("shot fired");
    
  }

}
