import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialogRef } from '@angular/material/dialog';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-end-game',
  templateUrl: './end-game.component.html',
  styleUrls: ['./end-game.component.scss']
})
export class EndGameComponent implements OnInit {

  winner: string;
  userId: string;

  constructor(public dialogRef: MatDialogRef<EndGameComponent>, private gameService: GameService, private auth: AngularFireAuth) { 
    this.auth.user.subscribe(v => {
      this.userId = v ? v.uid : null;
    });
  }

  quitGame(){
    this.dialogRef.close();
  }

  ngOnInit(): void {
    let winnerId = this.gameService.gameInfo.activePlayer;
    if (winnerId = this.userId) {
      this.winner = "You"
    }
    else {
      this.winner = "Opponent"
    }
  }

}
