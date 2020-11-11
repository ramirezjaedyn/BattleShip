import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  roomCode: string;
  displayName: string = '';
  

    navGame(){
   // this.gameService.navGame(this.roomCode)
    }

  constructor(private auth: AngularFireAuth, private router: Router, private _snackbar: MatSnackBar, ) { }




  loggedIn(){
    if(this.displayName){
      this.router.navigate([`/game:gameId`])
    } else {
      this._snackbar.open("Start New Game", '',{
        duration: 3000,
      })
    }
  }

  ngOnInit(): void {
    this.auth.user.subscribe(user => this.displayName = user ? user.displayName : '');
  }
  logout() {
    this.auth.signOut().then(() => { });
  }
    
}
  


  

   

  //constructor( private _snackBar: MatSnackBar, private router: Router, private gameService: GameService) { }

  


