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
      userId: null, 
      shipsLocked: false,
      shipsLeft: [],
      playerReady: false
    },
    gameId: this.gameId,
    boardReady: true,
    gameOver: false,
    winner: null,
    activePlayer: null
  }).then(res => this.router.navigate([`/game/${this.gameId}`]))
}


// Players set ships

// Start Game -- Game starts with player one
startGame(gameId) {
  this.afs.collection('game').doc(`${gameId}`).update({
    player1: {
      boardStatus: {},
      userId: this.userId,
      shipsLocked: true,
      shipsLeft: [],
      playerReady: true,
      activePlayer: true
    },
    player2: {
      boardStatus:{},
      userId: this.userId, 
      shipsLocked: true,
      shipsLeft: [],
      playerReady: true,
      activePlayer: false
    },
    gameId: this.gameId,
    boardReady: true,
    gameOver: false,
    winner: null,
  }).then(res => this.router.navigate([`/game/${this.gameId}`]))
}

// UpdateGame 
updateGame(gameId) {
  this.afs.collection('game').doc(`${gameId}`).update({
    player1: {
      boardStatus: {},
      userId: this.userId,
      shipsLocked: true,
      shipsLeft: [],
      playerReady: true,
      activePlayer: false
    },
    player2: {
      boardStatus:{},
      userId: this.userId, 
      shipsLocked: true,
      shipsLeft: [],
      playerReady: true,
      activePlayer: true
    },
    gameId: this.gameId,
    boardReady: true,
    gameOver: false,
    winner: null,
  }).then(res => this.router.navigate([`/game/${this.gameId}`]))
}

// Ships left and what type

// Game Winner 
winnerGame(gameId) {
  this.afs.collection('game').doc(`${gameId}`).update({
    player1: {
      boardStatus: {},
      userId: this.userId,
      shipsLocked: true,
      shipsLeft: [],
      playerReady: true,
      activePlayer: false
    },
    player2: {
      boardStatus:{},
      userId: this.userId, 
      shipsLocked: true,
      shipsLeft: [],
      playerReady: true,
      activePlayer: true
    },
    gameId: this.gameId,
    boardReady: true,
    gameOver: true,
    winner: true,
  }).then(res => this.router.navigate([`/game/${this.gameId}`]))
}}
