 import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InstructionsDialogComponent } from '../instructions-dialog/instructions-dialog.component';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  openDialog(){
  this.dialog.open(InstructionsDialogComponent); 
}

  ngOnInit(): void {
  }

}
