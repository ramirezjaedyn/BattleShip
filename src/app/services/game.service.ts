import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore' 
import { SocketService } from './socket.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  db = this.afs.collection('game')
  userId: string = "";
  gameId: string;
  boardReady: boolean = true;
  playerTurn: boolean = true;

  constructor(private router: Router, private auth: AngularFireAuth, private afs: AngularFirestore, private socketService: SocketService) { 
    this.auth.user.subscribe(v=> {
      this.userId = v ? v.uid : null;
    });
  
  }
 

// Create Game
createGame(gameId) {
// Unique Game ID  
this.gameId =  Math.random().toString(36).substring(2, 4) + Math.random().toString(36).substring(2, 8);
this.afs.collection('game').doc(`${gameId}`).set({
    player1: {
      boardStatus: {},
      userId: this.userId,
      // shipsLocked: false,
      // shipsLeft: [],
      playerReady: false
    },
    player2: {
      boardStatus:{},
      userId: null, 
      // shipsLocked: false,
      // shipsLeft: [],
      playerReady: false
    },
    boardReady: false,
    gameOver: false,
    winner: null,
    activePlayer: null
  }).then(res => this.router.navigate([`/game/${this.gameId}`]))
}


// Players set ships

submitBoard(board: Board, player) {
  // Who's board it is, what the board is, set shipsLocked to true, if BOTH ships are locked set boardReady to true
  this.afs.collection('game').doc(`${gameId}`).update({
    player1: {
      boardStatus: {},  // if it's player 1
      // userId: this.userId,
      // shipsLocked: true,
      // shipsLeft: [],
      playerReady: true, // this one???
    },
    player2: {
      boardStatus:{}, // if it's player 2
      userId: this.userId, 
      // shipsLocked: true,
      // shipsLeft: [],
      playerReady: true, // this one??
    },
    // gameId: this.gameId,
    // boardReady: true,
    // gameOver: false,
    // winner: null,
  })
    
  }


guessShot(col, row, player, boardStatus) {
// where and who
let activePlayer = 
let !activePlayer = 

if(this.boardStatus[row][col] === ? | activePlayer === true) { }
// compare shot to the other's board
this.boardStatus[row][col] === 2 | (activePlayer === false)
  // update the other's board accordingly


// if it's a hit, is that ship sunk?
if(this.boardStatus[row][col] === 2)
return "You missed"
  // If it is sunk, update shipsLeft 
    // If there aren't any check for winner

}

gameOver(col, row,) { }