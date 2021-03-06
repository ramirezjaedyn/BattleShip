import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { SocketService } from './socket.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireAuth } from '@angular/fire/auth';
import { Board } from '../interfaces/board.interface';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  db = this.afs.collection('game')
  userId: string = "";
  gameId: string;
  gameInfo: any = null

  constructor(private router: Router, private auth: AngularFireAuth, private snackBar: MatSnackBar, private afs: AngularFirestore, private socketService: SocketService) { 
    // set userId to value provided by Ang Fire Auth
    this.auth.user.subscribe(v=> {
      this.userId = v ? v.uid : null;
    });

  }

 createGame(){
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
    
  // Navigate them to the new game page
  }).then(res =>  this.router.navigate([`/game/${this.gameId}`]))

  // Subscribe to the document
  this.afs.collection('game').doc(`${this.gameId}`).valueChanges().subscribe(val=> this.gameInfo = val);
  }


 joinGame(gameId: string){
  // Does that game exist??
  this.afs.collection('game').doc(gameId).snapshotChanges().subscribe((res : any) => {
    let gameData = res.payload.data();
    if(gameData){
    
      // YES - GTFO
      // pop up an error
      if (gameData.inactivePlayer){  // THIS SHOULDN'T RUN WHEN THE SECOND PLAYER JOINS, BUT IT DOES DUE TO SNAPSHOTCHANGES()
        return;

      } else{
        // NO  - set inactive player, set this.gameId subscribe to that doc
        this.gameId = gameId;
        this.afs.collection('game').doc(`${this.gameId}`).update({
          inactivePlayer : this.userId,
        }).then(val=>
          this.afs.collection('game').doc(`${this.gameId}`).valueChanges().subscribe(data => {
            this.gameInfo = data
            this.router.navigate([`/game/${this.gameId}`]);
          })
        )
      }
    }
  });
 }

  submitBoard(board){
    // Create and set shallow copy of the boards
    let newBoards = {...this.gameInfo.boards};
    newBoards[this.userId] = board;  // links specific board info to userId
    // If second user to submit board, will submit board, increase numLocked, and set gameReady to true
    if(this.gameInfo.numLocked == 1){
      this.afs.collection('game').doc(`${this.gameId}`).update({boards: newBoards, numLocked: 2, gameReady: true});  
    }
    // If first user to submit, it will submit the board and increase the numLocked by one
    else{
      this.afs.collection('game').doc(`${this.gameId}`).update({boards: newBoards, numLocked: 1});
    }
  }


 guessShot(col: number, row: number){
    // shooter's userId
    let shooter = this.gameInfo.activePlayer;
    // victim's userId
    let victim = this.gameInfo.inactivePlayer;
    // If it is the proper user's turn and they clicked...
    if (this.userId === shooter) {
      console.log("Shooter successfully attempted a shot");
      let boards = {...this.gameInfo.boards};
      let victimBoardCoord = boards[victim][col][row]; 
      // Invalid location clicked
      if (victimBoardCoord === 2 || victimBoardCoord === 3 || victimBoardCoord === 4) {
        console.log("You've already clicked there in a past turn, try again");
      }
      // Clicked on an empty spot
      if (victimBoardCoord === 0) {
        console.log("You missed!");
        boards[victim][col][row] = 2; // changes value to "missed" 
        // Swap player statuses and update board
        this.afs.collection('game').doc(`${this.gameId}`).update({activePlayer: victim, inactivePlayer: shooter, 
          boards: boards}); 
      } 
      // Clicked on an untouched spot
      if (victimBoardCoord === 1) {
        console.log("Enemy hit!");
        boards[victim][col][row] = 3; // changes value to "hit" 
        // RUN FUNC TO CHECK IF SHIP HAS SUNK (MMP)
        // Check if the game is over
        let gameOver = this.checkIfGameOver(boards[victim]);
        if (gameOver) {
          console.log("GAME IS OVER"); 
          // Update firestore
          this.afs.collection('game').doc(`${this.gameId}`).update({gameOver: true, winner: shooter}); 
          this.showWinner(shooter, victim);
        }
        // Swap player statuses and update board
        this.afs.collection('game').doc(`${this.gameId}`).update({activePlayer: victim, inactivePlayer: shooter, 
          boards: boards}); 
      }
    }
    else {
      console.log("It isn't your turn to shoot");
    }
 }


 showWinner(winner, loser) {
    // since it is using the userId's it will be a bit unreadable... 
    console.log(`${winner} wins, ${loser} loses!`);
  }

 checkIfGameOver(board: Board): boolean{
  // Iterate through the board's keys
  for (const row in board) {
    // If any of the key's values include a 1, the game isn't over
    if (board[row].includes(1)) {
      return false;
    }
  }
  // If there are no 1s in board, game over
  return true;
 }
}

