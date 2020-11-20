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
      console.log(`userId: ${this.userId}`);
    });
  }

  quitGame(){
    this.dialogRef.close();
  }

  ngOnInit(): void {
    let winnerId = this.gameService.gameInfo.activePlayer;
    console.log(`WinnerId ${winnerId}`);
    console.log(`Loser ${this.gameService.gameInfo.inactivePlayer}`);
    console.log(`userId: ${this.userId}`);
    if (winnerId === this.userId) {
      this.winner = "You"
    }
    else {
      this.winner = "Opponent"
    }
  }

}
