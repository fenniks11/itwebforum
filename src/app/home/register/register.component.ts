import { Component, NgModule } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'register',
  templateUrl: './register.html',
  //   styleUrls: ["register.css"]
})
export class Register {
  constructor(private router: Router, private http: HttpClient, private snackBar: MatSnackBar) { };
  err = false;
  email = "";
  username = "";
  logged_in = !sessionStorage.getItem("_id") ? false : true;
  password = "";

  ngOnInit() {
    if (this.logged_in) this.router.navigate(["/"])
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  login() {
    this.router.navigate(['login'])
  }


  async register() {

    if (!await this.validateEmail(this.email)) {
      this.snackBar.open(`Format email salah!`, null, { duration: 5000 });
      this.email = "";
      return;
    }

    var body = { email: this.email, username: this.username, password: this.password }
    var res2 = await this.http.post("http://localhost:3000/api/user/register", body).toPromise() as any;

    if (!res2.success) {
      this.snackBar.open(`${res2.reason} sudah terpakai, silahkan coba ${res2.reason} yang lain`, null, { duration: 5000 })
      return;
    }

    await sessionStorage.setItem("_id", res2.id)
    this.snackBar.open(`Memproses...`, null, { duration: 2000 })
    setTimeout(() => {
      this.router.navigate(["profile", { fresh: true }])
    }, 2000);
  }
}