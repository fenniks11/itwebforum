import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'nav-bar',
    templateUrl: './nav-bar.html',
    styleUrls: ["nav-bar.css"]
})
export class NavBar {

    constructor(private router: Router) { }

    @Input() public root: any;
    @Input() public current: String;


    navigateTo(route) {
        this.router.navigate([route])
    }
}

