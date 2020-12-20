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
  keywords = "" as string;
  parent = "forum" //default parent

  async ngOnInit() {
    this.login = !sessionStorage.getItem("_id") ? false : true
  }

  async update() {
    let title = await window.localStorage.getItem("activeTitle");
    this.titleHeader = !title.length ? "Cari sesuatu..." : title;
    this.parent = window.localStorage.getItem("parent")
    
  }

  tambahForum() {
    this.router.navigate(['forum/tambah'], { skipLocationChange: true })
  }
  tambahPertanyaan() {
    this.router.navigate(['qna/tambah'], { skipLocationChange: true })
  }
  logout() {
    this.snackBar.open(`Logout akun?`, "Logout", { duration: 5000 }) //ganti ini jadi yang lebih cocok nanti
      .onAction().subscribe(() => {
        sessionStorage.clear()
        window.location.reload()
      });
  }

  cari() {
    if (this.keywords.length < 3) return;
    this.router.navigate(['search', { keywords: this.keywords }])
  }


  compilerun() {
    this.router.navigate(['compilerun', { lang: "njs", code: "console.log('Hello World!')" }]);
  }

  profile() {
    this.router.navigate(['profile'])
  }

  Login() {
    this.router.navigate(['login'])
  }

  forum() {
    this.router.navigate(['forum'])
  }

}
