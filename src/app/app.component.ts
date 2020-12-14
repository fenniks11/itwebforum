import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { EventEmitter } from 'events';
import { HeaderForum } from './forum/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tubes-pwl';
  Login = false;
  constructor(private router: Router, private route: ActivatedRoute) { };
  ngOnInit() {

    this.router.events.subscribe((ev) => {

      if (ev instanceof NavigationEnd) {
        //Route change
        HeaderForum.prototype.titleHeader = "";
         
       }
    });

    this.Login = sessionStorage.getItem("_id") == null ? false : true;
  }
}