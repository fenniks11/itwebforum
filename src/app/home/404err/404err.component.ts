import { Component, NgModule } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector: 'err404',
    templateUrl: './404err.html',
    //   styleUrls: ["login.css"]
})
export class Err404 {
    constructor(private router: Router) { }
    backToHome() {
        this.router.navigate(['/'])
    }
}
