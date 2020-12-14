import { Component, NgModule } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'forum',
  templateUrl: './forum.html',
  styleUrls: ["forum.css"]
})
export class Forum {
  constructor(private router: Router) { };
  ngOnInit() {
    if (sessionStorage.getItem("_id") == null) sessionStorage.setItem("_id", "");
  }
  list() {
    this.router.navigate(['forum/list'])
  }
  tambah() {
    this.router.navigate(['forum/tambah'], { skipLocationChange: true })
  }
}

