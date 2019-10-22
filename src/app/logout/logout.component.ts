import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {

    // Remove user token if it was set
    if(localStorage.getItem('userToken') !== "undefined"){
      localStorage.removeItem('userToken');
    }

    // Redirect back home
    this.router.navigate(['']);

  }

}
