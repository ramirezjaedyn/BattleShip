import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-end-game',
  templateUrl: './end-game.component.html',
  styleUrls: ['./end-game.component.scss']
})
export class EndGameComponent implements OnInit {

  winner: string = "John"

  constructor() { }

  playAgain(){
    // NYI
  }
  quitGame(){
    // NYI
  }

  ngOnInit(): void {
  }

}
