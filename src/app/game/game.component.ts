import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EndGameComponent } from '../end-game/end-game.component';
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

  constructor(private afs: AngularFirestore, private gameService: GameService, private auth: AngularFireAuth, 
    private actr: ActivatedRoute, public dialog: MatDialog, private router: Router) {
    this.afs.collection('game').doc(`${this.actr.snapshot.params.gameId}`).valueChanges().subscribe(val=> {
      this.gameInfo = val ?  val: null;
      if (this.gameInfo.gameOver){
        this.showWinner();
      }
    });
    this.auth.user.subscribe(v=> this.userId = v ? v.uid : null);
   }

  showWinner() {
    const dialogRef = this.dialog.open(EndGameComponent);
    dialogRef.afterClosed().subscribe(v=> this.router.navigate(['/home']));
  }

  ngOnInit(): void {
  }

}

