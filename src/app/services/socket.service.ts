import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

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

    this.socket = io.connect();
    this.socket.on('joinGame', (displayName, gameId) => {
      displayName = displayName;
      gameId = gameId;
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
  joinGame(displayName: string, gameId: string) {
    this.socket.emit('joinGame', displayName, gameId);
  }

  // Leave game function
  leaveGame(displayName: string, gameId: string) {
    this.socket.emit('leaveGame', displayName, gameId);
  }

  sendChat(msg: string){
    this.socket.emit('newMessage', {msg: msg, displayName: this.displayName})
  }

  // Create game function to setup host socket

  roomClosed() {
    this.socket.emit('roomClosed')
  }
}
