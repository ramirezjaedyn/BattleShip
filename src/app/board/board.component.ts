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

  selectedShip: Ship = { name: "destroyer", length: 2 }; // will be the most recent ship clicked on by the user

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


  // this.gameService.checkOppBoard(row, col); // WORK WITH JAEDYN TO CREATE METHOD IN THE SERVICE



  getBGColor(row, col) { // NEED TO TAKE INTO ACCOUNT WHICH BOARD WE ARE SHOWING
    let clickedValue = this.boardStatus[row][col];
    if (clickedValue === 0) {
      return "blue";
    }
    if (clickedValue === 1) {
      return "gray";
    }
    if (clickedValue === 2) {
      return "black";
    }
    if (clickedValue === 3) {
      return "red";
    }
  }

  shipPreview(row, col) {

    if (this.boardStatus[row][col] === 0) {
      console.log("this spot is a '0'")
      // Horizontal ships
      if (this.isVertical == 'false') {
        //                should be a global var
        for (let i = col; i < col+this.selectedShip.length; i++) {
          console.log(this.boardStatus[row][i])
          
        }
      }
      else{
        for (let i = parseInt(row); i < (parseInt(row) + this.selectedShip.length); i++) {
          // If i > 9 break out
          console.log(this.boardStatus[i][col])
          
        }
      }
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

}
