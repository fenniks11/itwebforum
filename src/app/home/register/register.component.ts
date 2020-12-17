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
  login() {
    this.router.navigate(['login'])
  }
  async register() {

    var body = { email: this.email, username: this.username, password: this.password }
    var res2 = await this.http.post("http://localhost:3000/api/user/register", body).toPromise() as any;

    if(!res2.success) return alert(`${res2.reason} sudah terpakai, silahkan coba ${res2.reason} yang lain`)

    await sessionStorage.setItem("_id", res2.id)
    this.snackBar.open(`Memproses...`, null, { duration: 2000 })
    setTimeout(() => {
      this.router.navigate(["profile", { fresh: true }])
    }, 2000);
  }
}