import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameService } from '../services/game.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  gameId: string;
  userId: string = "";
  uid: string;
  gameCode: string;
  

  navGame(){
    this.gameService.navGame(this.gameId)
  }

  constructor(private auth: AngularFireAuth, private router: Router, private _snackbar: MatSnackBar, private gameService: GameService) { }

  loggedIn(){
    console.log(`user id from loggedIn(): ${this.userId}`)
    if(this.userId){
      this.gameService.createGame(this.userId);
    } else {
      this._snackbar.open("Start New Game", '',{
        duration: 3000,
      })
    }
  }

  ngOnInit(): void {
    this.auth.user.subscribe(v => {
      return this.userId = v ? v.uid : '';
    });
  }
  //user ? user.userId 
  logout() {
    this.auth.signOut().then(() => { });
  }
    
}
  


  

   

  //constructor( private _snackBar: MatSnackBar, private router: Router, private gameService: GameService) { }

  


