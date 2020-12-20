import { Component, NgModule } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'qna',
  templateUrl: './qna.html',
  styleUrls: ["qna.css"]
})
export class QuestionAndAnswer {
  constructor(private router: Router) { };
  ngOnInit() {
    if (sessionStorage.getItem("_id") == null) sessionStorage.setItem("_id", "");
  }
  list() {
    this.router.navigate(['qna/list'])
  }
  tambah() {
    this.router.navigate(['qna/tanya'], { skipLocationChange: true })
  }
}

