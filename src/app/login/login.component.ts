import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  
  constructor(public auth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
  }
  
  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(v => {
      this.router.navigate(['/home'])
    });
  }
  logout() {
    this.auth.signOut().then(() => { });
  }
  
}