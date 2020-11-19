import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-end-game',
  templateUrl: './end-game.component.html',
  styleUrls: ['./end-game.component.scss']
})
export class EndGameComponent implements OnInit {

  winner: string = "John"

  constructor(private gameService: GameService, private router: Router) { }

  playAgain(){
    // NYI
  }
  quitGame(){
    // Delete game from database
    this.gameService.deleteGame()
    // Route to the home screen
    this.router.navigate(['/home']);
  }

  ngOnInit(): void {
  }

}
