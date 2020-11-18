import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { Message } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: any;
  displayName: string;
  constructor(private router: Router, private auth: AngularFireAuth) {

    this.auth.user.subscribe(v=> {
      this.displayName = v ? v.displayName : null;
    });

    //this.socket = io.connect();
    this.socket.on('joinGame', (gameId) => {
    })

    this.socket.on('gameEnd', (gameId) => {
      this.socket.on('roomClosed', () => {
        this.router.navigate(["/home"])
      })
    })
  }

  public get chatMessages$() {
    return new Observable((observer) => {
      this.socket.on('newMessage', (message) => {
        observer.next(message);
      })
    })
  }

  // Join game function
  joinGame(gameId: string) {
    this.socket.emit('joinGame', gameId);
  }

  // Leave game function
  leaveGame(displayName: string, gameId: string) {
    this.socket.emit('leaveGame', displayName, gameId);
  }

  sendMessage(body: string){
    let msg: Message = {
      displayName: this.displayName,
      body: body
    }
    this.socket.emit('newMessage', msg);
  }

  // Create game function to setup host socket

  roomClosed() {
    this.socket.emit('roomClosed')
  }
}
