import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore' 
import { SocketService } from './socket.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  // db = this.afs.collection('game')
  userId: string = "";
  gameId: string;
  boardReady: boolean = true;
  playerTurn: boolean = true;
  gameInfo: any = null

  constructor(private router: Router, private auth: AngularFireAuth, private afs: AngularFirestore, private socketService: SocketService) { 
    this.auth.user.subscribe(v=> {
      this.userId = v ? v.uid : null;
    });
  
  }
 createGame(){
  this.gameId =  Math.random().toString(36).substring(2, 4) + Math.random().toString(36).substring(2, 8);
  this.afs.collection('game').doc(`${this.gameId}`).set({
    gameId: this.gameId,
    gameOver: false,
    winner: null,
    gameReady: false,
    numLocked: 0,
    activePlayer: this.userId,
    inactivePlayer: null,
    boards: {}
  })
  // subscribe to that doc
  this.afs.collection('game').doc(`${this.gameId}`).valueChanges().subscribe(val=> this.gameInfo = val);
  
  // navigate them to that page
  
 }


 joinGame(gameId: string){
  // Does that game exist?? 
    // YES - Is there an inactive player?
      // YES - GTFO
      // NO  - set inactive player, set this.gameId subscribe to that doc
      // NO - Show error
 }


 submitBoard(board){
   // set appropriate board and increment numLocked by 1, if it's now 2, set gameReady to true
   let newBoards = {...this.gameInfo.boards};
   newBoards[this.userId] = board;  // links specific board info to userId
   if(this.gameInfo.numLocked == 1){
    this.afs.collection('game').doc(`${this.gameId}`).update({boards: newBoards, numLocked: 2, gameReady: true});  
   }
   else{
    this.afs.collection('game').doc(`${this.gameId}`).update({boards: newBoards, numLocked: 1});
   }
 }


 guessShot(col: number, row: number){
    // I'm active 1234
    // Inactive is 5678
    // I take a shot it says ok who's inactive
    // Check game.boards.5678 at some coordinates []
    // Let's say I shot A5 (0, 4)
    // Hey check game.boards.5678.0[4] 
        // Is it a 2,3,4? Ignore the shot and don't continue
        // Is it 0 then change to 2
        // Is it a 1, change to 3 check for gameOver
        // Swap inactive and active players if not gameOver
 }


 showWinner(){
   // NYI
 }


}