import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  // Check for who the logged in user is
  userId: string;
  
  // enemy userId pulled from firestore
  // In template, you would pass the userId to the board (so you can pull only that specific board)
  constructor() { }


  ngOnInit(): void {
  }

}
