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
  //  Game Collection(s)
  //  Players (count and people)
  //  If game over - boolean
  //  winner - string
  //  Whose Turn it is - ??
  //  Player 2 Board Status - {}
  //  Player 1 board
  //  Game ready to start - boolean

// Game Functions 

// Create Game
createGame(gameId) {
// Unique Game ID  
this.gameId =  Math.random().toString(36).substring(2, 4) + Math.random().toString(36).substring(2, 8);
this.afs.collection('game').doc(`${gameId}`).set({
    player1: {
      boardStatus: {},
      userId: this.userId,
      shipsLocked: false,
      shipsLeft: [],
      playerReady: false
    },
    player2: {
      boardStatus:{},
      userId: null, // nothing yet
      shipsLocked: false,
      shipsLeft: [],
      playerReady: false
    },
    gameId: this.gameId,
    boardReady: true,
    gameOver: false,
    winner: null,
    activePlayer: null
  }); 
}


// Players set ships


// Board Ready
startGame() {

}


// Locked Board Function 
lockedBoard(gameId) {
  this.afs.collection('game').doc(`${gameId}`).set({
    boardLocked: true 
  }); 
}
//Update Board
// Player One Starts

// Rotate Turns

// Game over = When a player reaches 14 points game is over and winner is announced
gameOver() {

}

// Replay
replay() {

}

// Leave Game
leaveGame() {

}
}
