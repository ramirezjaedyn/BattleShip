import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  user;
  constructor(private afAuth: AngularFireAuth, private router: Router) { 
    this.user = this.afAuth.authState;
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login'])
    });
  }

  ngOnInit(): void {

  }

}
