import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-end-game',
  templateUrl: './end-game.component.html',
  styleUrls: ['./end-game.component.scss']
})
export class EndGameComponent implements OnInit {

  winner: string = "John"

  constructor(public dialogRef: MatDialogRef<EndGameComponent>) { }

  quitGame(){
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
