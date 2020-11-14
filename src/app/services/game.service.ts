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
    this.router.navigate([`/game/${this.gameId}`])
  }


  joinGame(gameId: string) {
    console.log(`The game ID being passed in from home comp: ${gameId}`)
    console.log(`The user who will become the "inactivePlayer": ${this.userId}`)
    let docRef = this.db.doc(`${gameId}`)

    // Does that game exist??
    docRef.get().toPromise().then(doc => {
      if (doc.exists) {
          let inactivePlayer = doc.data()['inactivePlayer'];
          console.log("Is there some value in the inactivePlayer field?", inactivePlayer);
          if (inactivePlayer !== null) {
            // YES - Is there an inactive player?
            console.log('YES - Is there an a player in the inactivePlayer field')
            return false;
          } else {
            // NO  - set inactive player, set this.gameId subscribe to that doc
            console.log("Setting canJoin to true")
            console.log('NO  - set inactive player, set this.gameId subscribe to that doc')
            docRef.update({inactivePlayer: `${this.userId}`});
            //docRef.valueChanges().subscribe(val=> this.gameInfo = val);
            return true;
          }
      } else {
          // doc.data() will be undefined in this case
          // NO - Show error
          console.log("No such document!");
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

    docRef.valueChanges().subscribe(val => {this.gameInfo = val; console.log(this.gameInfo, this.gameInfo)});
    //console.log(this.gameInfo, this.gameInfo['inactivePlayer'])
    //let inactivePlayerVal = this.gameInfo.inactivePlayer;
    //console.log(`What is inactivePlayer value right now!: ${inactivePlayerVal}`)
    //if (inactivePlayerVal === null) {
    //  return false;
    //} else { 
    //  return true;
    //}
    //return false;
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
    // shooter's userId
    let shooter = this.gameInfo.activePlayer;
    // victim's userId
    let victim = this.gameInfo.inactivePlayer;
    // If it is the proper user's turn and they clicked...
    if (this.userId === shooter) {
      console.log("Shooter shot");
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
        // Swap player statuses
        this.afs.collection('game').doc(`${this.gameId}`).update({activePlayer: victim, inactivePlayer: shooter, 
          boards: boards}); 
      } 
      // Clicked on an untouched spot
      if (victimBoardCoord === 1) {
        console.log("Enemy hit!");
        boards[victim][col][row] = 3; // changes value to "hit" 
        // RUN FUNC TO CHECK IF GAME OVER (any 1's left on the victim's board)
        // Swap player statuses and update DB boards
        this.afs.collection('game').doc(`${this.gameId}`).update({activePlayer: victim, inactivePlayer: shooter, 
          boards: boards}); 
      }
    }
    else {
      console.log("It isn't your turn to shoot");
    }
    
    
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