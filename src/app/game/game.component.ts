import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  // Check for who the logged in user is
  userId: string;
  gameInfo: any = null; // houses game data
  playersTurn: string = "";

  constructor(private afs: AngularFirestore, private gameService: GameService, private auth: AngularFireAuth) {
    this.gameInfo = this.gameService.gameInfo;
    this.playersTurn = this.gameInfo.activePlayer ;
    
    this.auth.user.subscribe(v=> {
      this.userId = v ? v.uid : null;
      if (this.userId == null){
        this.playersTurn= "Waiting for game to be ready..."
      }
      else if (this.userId === this.playersTurn) {
        this.playersTurn = "User"
      }
      else {
        this.playersTurn = "Opponent"
      }
    });

   }


  ngOnInit(): void {
  }

}
