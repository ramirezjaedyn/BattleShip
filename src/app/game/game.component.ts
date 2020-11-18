import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private afs: AngularFirestore, private gameService: GameService, private auth: AngularFireAuth, private actr: ActivatedRoute) {
    this.afs.collection('game').doc(`${this.actr.snapshot.params.gameId}`).valueChanges().subscribe(val=> this.gameInfo = val ?  val: null);
    this.auth.user.subscribe(v=> this.userId = v ? v.uid : null);
   }


  ngOnInit(): void {
  }

  gameOver(){
    this.gameService.openDialog()
  }

}

