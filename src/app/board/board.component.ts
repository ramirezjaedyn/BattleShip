import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Board } from '../interfaces/board.interface';
import { Ship } from '../interfaces/ship.interface';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() isUserBoard: boolean; // Tells the component whether it is the user's or opponent's board

  // Different ships that the user can place or destroy on the board
  shipsRemaining: Array<Ship> = [
    { name: "destroyer", length: 2 },
    { name: "submarine", length: 3 },
    { name: "battleship", length: 4 },
    { name: "carrier", length: 5 },
  ];

  coords: Array<Array<any>> = []

  selectedShip: Ship = this.shipsRemaining[0]; // Next ship ready to be placed on user's board
  objectKeys = Object.keys;
  boardStatus: Board = //isUserBoard ? below : null
    // 0: empty, 1: untouched ship, 2: miss, 3: hit, 4: sunk ship
    { //  1  2  3  4  5  6  7  8  9  10
      0: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
      1: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
      2: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
      3: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
      4: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
      5: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
      6: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
      7: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
      8: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
      9: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
    }
  rows = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
  boardValue: number; // number 0-4 that corresponds to board data(0: empty, 1: untouched ship, 2: miss, 3: hit, 4: sunk ship)

  isVertical: string = "false"; // will be used to determine whether a ship is placed horizontal or vertical

  constructor(private gameService: GameService, private afs: AngularFirestore) { 
    // Subscribe to game data from AFS
    this.afs.collection('game').doc(`${this.gameService.gameId}`).valueChanges().subscribe((data: any) => {
     // If it's the user's board, subscribe to the user's board, otherwise subscribe to the other board
     if(data && data.boards){
      let boardKeys = this.objectKeys(data.boards);
      let otherUser = boardKeys.filter(v=> v !== this.gameService.userId)[0];
      if(this.isUserBoard && data.boards[this.gameService.userId]){
        this.boardStatus = {...data.boards[this.gameService.userId]};
      }
      else if(otherUser && !this.isUserBoard){
        this.boardStatus = {...data.boards[otherUser]};
      }
    }
    })
  }

  ngOnInit(): void { }

  // Will change styling class to show a user's board normally, but hide an enemies ships
  getClass(val: string){
    val = !this.isUserBoard && val.match(/-1$/g) ? '0' : val
    return `cell-${val}`
  } 
  //if(val.match(/-1$/g))

  /**
   * Manipulates the board values, and will remove ships from shipsRemaining and/or submit board when all ships are placed
   * @param val number, board value 0-5
   */
  markCoords(val){
    this.coords.forEach(c =>{
      this.boardStatus[c[0]][c[1]] = val; 
  
    })
    // if ship is placed on board
    if(val === `${this.selectedShip.name}-1` ){ 
      this.coords = [];
      this.shipsRemaining.shift();
      // if there are ships then
      if(this.shipsRemaining.length > 0){
        this.selectedShip = this.shipsRemaining[0]
      }
      else{
        // service function to send ENTIRE board and lock ships
        this.gameService.submitBoard(this.boardStatus);
      }
    }
  }
  
  /**
   * As mouse hovers on a user's own board when placing ships, if it is a valid spot, the entire shadow of the ship will display.
   * If user decides to 'click' and place ship, set turns "true", and alters the board values to place that ship.
   * @param row number value 0-9 (x-axis)
   * @param col number value 0-9 (y-axis)
   * @param set boolean, will be true when user clicks spot. Defaults as false.
   */
  shipPlacement(row, col, set) {
    this.markCoords('0')
    if (this.boardStatus[row][col] === '0' || this.boardStatus[row][col] === `${this.selectedShip.name}-5` ) {
      this.coords = []
      // Horizontal ships
      if (this.isVertical == 'false') {
        // Iterate across the columns in the same row
        for (let i = col; i < col+this.selectedShip.length; i++) {
          // If it is a valid spot on the board, add it to the coords array
          if(this.boardStatus[row][i] === '0' || this.boardStatus[row][i] === `${this.selectedShip.name}-5` ){
            this.coords.push([row, i])
          }
          // If not a valid spot on the board, reset the coord array and break
          else{
            this.coords = []
            break;
          }
        }
        
      }
      // Vertical ships
      else{
        // Iterate down the rows within the same column
        for (let i = parseInt(row); i < (parseInt(row) + this.selectedShip.length); i++) {
          // If the coord is on the board and not an untouched ship, add it to the coords array
          if( i <= 9 && (this.boardStatus[i][col] === '0' || this.boardStatus[i][col] === `${this.selectedShip.name}-5`)){
            this.coords.push([i, col])
          }
          // If not a valid spot, reset coord array and break
          else{
            this.coords = [];
            break;
          }
        }
      }
      // If there is a valid spot in the projected ship placement & the user clicks on the spot, let them place it
      if (this.coords.length !== 0 && set) { // Why !==0 is not a string.?
        // if(val.match(/-1$/g))
        this.markCoords(`${this.selectedShip.name}-1`) // this.selectedShip.name
        // SHIPSPLACED ARRAY COULD BE ADDED HERE TO TRACK SPECIFIC SHIPS SUNK (MMP)
      }
      else {
        this.markCoords(`${this.selectedShip.name}-5`);
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
