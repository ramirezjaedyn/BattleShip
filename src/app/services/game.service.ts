import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { SocketService } from './socket.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireAuth } from '@angular/fire/auth';
import { Board } from '../interfaces/board.interface';
import { MatDialog } from '@angular/material/dialog';
import { EndGameComponent } from '../end-game/end-game.component';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  db = this.afs.collection('game')
  userId: string = "";
  gameId: string;
  gameInfo: any = null

  constructor(private router: Router, private auth: AngularFireAuth, private snackBar: MatSnackBar, private afs: AngularFirestore, 
    private socketService: SocketService, public dialog: MatDialog) {
    // set userId to value provided by Ang Fire Auth
    this.auth.user.subscribe(v => {
      this.userId = v ? v.uid : null;
    });

  }

  /**
   * Creates a randomly generated gameId, then creates a new game document in AngularFireStore housing that 
   * specific game's information.  It then navigates the user to the new gameId's game page and subscribes to any
   * new data via the 'gameInfo' variable.
   */
  createGame() {
    this.gameId = Math.random().toString(36).substring(2, 4) + Math.random().toString(36).substring(2, 8);
    this.afs.collection('game').doc(`${this.gameId}`).set({
      gameId: this.gameId,
      gameOver: false,
      winner: null,
      gameReady: false,
      numLocked: 0,
      activePlayer: this.userId,
      inactivePlayer: null,
      boards: {}
    // Navigate user to the new game page
    }).then(res => {
      this.socketService.joinGame(this.gameId);
      this.router.navigate([`/game/${this.gameId}`])
    })
    // Subscribe to the document
    this.afs.collection('game').doc(`${this.gameId}`).valueChanges().subscribe(val => this.gameInfo = val);
  }

  /**
   * Deletes the AngularFireStore game information via the game's gameId
   */
  deleteGame() {
    this.afs.collection('game').doc(`${this.gameId}`).delete();
  }

  resetGame() {
    // NYI  Will be used to restart the game between 2 individuals
  }

  /**
   * Tries to join a user to an existing game via the gameId.  If successful, will add the user's info to the AFS game data
   * and routes them to the game page.
   * @param gameId unique game code
   */
  joinGame(gameId: string) {
    // Does that game exist??
    this.afs.collection('game').doc(gameId).snapshotChanges().subscribe((res: any) => {
      let gameData = res.payload.data();
      // If the game exists...
      if (gameData) {
        // If there are already 2 players in the game, don't let them join
        if (gameData.inactivePlayer) { 
          return;
        } 
        // If the game has a spot, let them join
        else {
          // Set the gameId to the game code and update AFS
          this.gameId = gameId;
          this.afs.collection('game').doc(`${this.gameId}`).update({
            inactivePlayer: this.userId,
          }).then(val=>{
            this.socketService.joinGame(this.gameId);
            this.router.navigate([`/game/${this.gameId}`]);
            this.afs.collection('game').doc(`${this.gameId}`).valueChanges().subscribe(data => {
              this.gameInfo = data;
            })
          })
        }
      }
    });
  }

  /**
   * Submits board to the specific game document and updates the number of players locked in and will set gameReady
   * to 'true' if both boards have been submitted
   * @param board specific board object
   */
  submitBoard(board) {
    // Create and set shallow copy of the boards
    let newBoards = { ...this.gameInfo.boards };
    newBoards[this.userId] = board;  // links specific board info to userId
    // If second user to submit board, will submit board, increase numLocked, and set gameReady to true
    if (this.gameInfo.numLocked == 1) {
      this.afs.collection('game').doc(`${this.gameId}`).update({ boards: newBoards, numLocked: 2, gameReady: true });
    }
    // If first user to submit, it will submit the board and increase the numLocked by one
    else {
      this.afs.collection('game').doc(`${this.gameId}`).update({ boards: newBoards, numLocked: 1 });
    }
  }

  /**
   * Takes the coordinates of the shot, and determines if it is a valid shot. It then updates the board's values accordingly.
   * @param col board column number
   * @param row board row number
   */
  guessShot(col: number, row: number) {
    // shooter's userId
    let shooter = this.gameInfo.activePlayer;
    // victim's userId
    let victim = this.gameInfo.inactivePlayer;
    // If it is the proper user's turn and they clicked...
    if (this.userId === shooter) {
      console.log("Shooter successfully attempted a shot");
      let boards = { ...this.gameInfo.boards };
      let victimBoardCoord = boards[victim][col][row];
      // Invalid location clicked
      if (victimBoardCoord === '2' || victimBoardCoord.match(/-3$/g) || victimBoardCoord === '4' || victimBoardCoord === '5') {
        console.log("You've already clicked there in a past turn, try again");
      }
      // Clicked on an empty spot
      if (victimBoardCoord === '0') {
        console.log("You missed!");
        boards[victim][col][row] = '2'; // changes value to "missed" 
        // Swap player statuses and update board
        this.afs.collection('game').doc(`${this.gameId}`).update({
          activePlayer: victim, inactivePlayer: shooter,
          boards: boards
        });
      }
      // Clicked on an untouched spot
      if (victimBoardCoord.match(/-1$/g)) {
        console.log("Enemy hit!");
        let ship = victimBoardCoord.split('-')[0];
        boards[victim][col][row] = `${ship}-3`; // changes value to "hit" 
        boards[victim] = this.checkSunkShip(ship, boards[victim]);
        // RUN FUNC TO CHECK IF SHIP HAS SUNK (MMP)
        
        // Check if the game is over
        let gameOver = this.checkIfGameOver(boards[victim]);
        if (gameOver) {
          console.log("GAME IS OVER");
          // Update firestore
          this.afs.collection('game').doc(`${this.gameId}`).update({ gameOver: true, winner: shooter });
          this.showWinner();
          // NEED TO PROMPT USERS TO PLAY AGAIN OR QUIT GAME THEN DELETE
          // deleteGame()
        }
        // Swap player statuses and update board
        this.afs.collection('game').doc(`${this.gameId}`).update({
          activePlayer: victim, inactivePlayer: shooter,
          boards: boards
        });
      }
    }
    else {
      console.log("It isn't your turn to shoot");
    }
  }


  showWinner() {
    const dialogRef = this.dialog.open(EndGameComponent);
    dialogRef.afterClosed().subscribe(v=> this.router.navigate(['/home']));
  }

  /**
   * Checks entire board object and sees if there are any untouched ship coordinates (1s) left.
   * @param board Board object
   * @returns boolean-- true if game is over
   */
  checkIfGameOver(board: Board): boolean {
    // Iterate through the board's keys
    for (const row in board) {
      // If any of the key's values include a 1, the game isn't over
      if (board[row].filter(val => val.match(/-1$/g)).length > 0) 
        return false;
    }
    // If there are no 1s in board, game over
    return true;
  }

  checkSunkShip(ship,board){
    const lengths = {destroyer: 2, submarine: 3, battleship: 4, carrier: 5};
    let hitsNeeded = lengths [ship];
    let sunk = false
    for(let row in board){
      for(let i = 0; i < board[row].length; i++){
        if(board[row][i] === `${ship}-3`){
          hitsNeeded--;

          if(hitsNeeded == 0){
            sunk = true;
            break;
          }
        }
      }
      if(sunk) break;
    }
    console.log(sunk);
    console.log(hitsNeeded);

    hitsNeeded = lengths[ship]
    if(sunk){
      let sunk = false;
      for(let row in board){
        for(let i = 0; i < board[row].length; i++){
          if(board[row][i] === `${ship}-3`){
            hitsNeeded--;
            board[row][i] = '4'
            if(hitsNeeded == 0 ){
              sunk = true;
              break;
            }
          }
        }
        if(sunk) break;
      }
    }
    return board;
  }
}