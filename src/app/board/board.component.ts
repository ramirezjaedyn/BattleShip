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
  boardStatus: Board = //isUserBoard ? below : null
    // 0: empty, 1: untouched ship, 2: miss, 3: hit, 4: sunk ship
    { //  1  2  3  4  5  6  7  8  9  10
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
  rows = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
  boardValue: number; // number 0-4 that will tell the template which background color to choose

  isVertical: string = "false"; // will be used to determine whether a ship is placed horizontal or vertical
  boxColor: string; // the color that the boxes will change to on the board

  constructor(private gameService: GameService, private auth: AngularFireAuth) { 
    // isUser ? subscribe to the enemies board replacing 1s with 0s
  }


  ngOnInit(): void {
  }

  markCoords(val){
    this.coords.forEach(c =>{
      this.boardStatus[c[0]][c[1]] = val; 
  
    })
    // if ship is placed on board
    if(val === 1){ 
      this.coords = [];
      this.shipsRemaining.shift();
      // if there are ships then
      if(this.shipsRemaining.length > 0){
        this.selectedShip = this.shipsRemaining[0]
      }
      else{
        // service function to send ENTIRE board and lock ships
        this.gameService.submitBoard(this.coords)
      }
    }
  }
  

  shipPlacement(row, col, set) {
    this.markCoords(0)
    if (this.boardStatus[row][col] === 0 || this.boardStatus[row][col] === 5) {
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
      // If there is a valid spot in the projected ship placement & the user clicks on the spot, let them place it
      if (this.coords.length !== 0 && set) {
        this.markCoords(1);
        // could add functionality that takes those coordinates and adds them to a 'shipsPlaced' array (MMP)
      }
      else {
        this.markCoords(5);
      }
      
    }
  }
  guessShot(col, row) {
    console.log("player guessed shot");
    this.gameService.guessShot(col, row);
    
  }

  /**
   * This func is ran on each iteration of the *ngFor displaying "Your Ships Remaining:"
   * Will turn the font weight of the first index bold, and the rest will be normal
   * @param idx index of the ship in the *ngFor
   * @returns "bold" if it is the first in the list, otherwise "normal"
   */
  checkIfFirst(idx) {
    if (idx === 0) {
      return "bold"
    }
    return "normal"
  }

  }


// Start off hardcoded local board (or subscribed if it's the non user board)

// Hover and see ship placement (done)

// Place a ship (done)

// Lock ships
  // Send entire board to firebase
  // Subscribe to the user's board in firebase

// Guess a shot
  // Function that checks 

// Update the board