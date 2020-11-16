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
    // subscribe to that doc
  // navigate them to that page
  }).then(res => this.router.navigate([`/game/${this.gameId}`]))
  }


 joinGame(gameId: string){
  // Does that game exist??
  // this.afs.firestore.doc(`${this.gameId}`).get() // doc won't work syntax change
    this.afs.collection('game').doc(gameId).snapshotChanges().subscribe((res : any) => {
      let gameData = res.payload.data();
      if(gameData){
        // YES - Is there an inactive player?
        // let data = a.payload.doc.data();
        let gameData = res.data;
        // YES - GTFO
        // pop up an error
        if (gameData.inactivePlayer){
          console.log("Game is full.")
          return true;

        } else{
          // NO  - set inactive player, set this.gameId subscribe to that doc
          this.afs.doc(`${this.gameId}`).update({
            inactivePlayer : this.userId,
          }).then(val=>
            this.afs.collection('game').doc(`${this.gameId}`).valueChanges().subscribe(data => this.gameInfo = data)
          )
        }

      }
    });
  
 }




 submitBoard(board){
   // set appropriate board and increment numLocked by 1, if it's now 2, set gameReady to true
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
