import { Component, NgModule, Input } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'header-forum',
  templateUrl: './header.html'
})
export class HeaderForum {
  @Input() public titleHeader: string;
  constructor(private router: Router, private snackBar: MatSnackBar) { };

  login = false;

  async ngOnInit(){
    this.login = !sessionStorage.getItem("_id") ? false : true
  }

  tambah() {
    this.router.navigate(['forum/tambah'], { skipLocationChange: true })
  }
  logout() {
    this.snackBar.open(`Logout akun?`, "Logout", { duration: 5000 }) //ganti ini jadi yang lebih cocok nanti
      .onAction().subscribe(() => {
        sessionStorage.clear()
        window.location.reload()
      });
  }
  

  profile(){
    this.router.navigate(['profile'])
  }

  Login(){
    this.router.navigate(['login'])
  }

  forum() {
    this.router.navigate(['forum'])
  }

}

