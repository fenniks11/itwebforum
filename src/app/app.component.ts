import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { EventEmitter } from 'events';
import { HeaderApp } from './home/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tubes-pwl';
  Login = false;
  constructor(private router: Router, private route: ActivatedRoute, private window: Window) { };
  async ngOnInit() {

    this.router.events.subscribe(async (ev) => {

      if (ev instanceof NavigationEnd) {
        //Route change        
        if(sessionStorage.getItem("activate_id")) return this.router.navigate(['activate']);
        if (ev.url.includes("forum")) window.localStorage.setItem("parent", "forum")
        else if (ev.url.includes("qna")) window.localStorage.setItem("parent", "qna")

        window.localStorage.setItem("activeTitle", "")
        setTimeout(() => { HeaderApp.prototype.update() }, 0);
      }
    });

    this.Login = sessionStorage.getItem("_id") == null ? false : true;
  }
}