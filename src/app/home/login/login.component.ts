import { Component, NgModule } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  //   styleUrls: ["login.css"]
})
export class Login {
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private snackBar: MatSnackBar) { };
  wrong = false;
  logged_in = !sessionStorage.getItem("_id") ? false : true;
  email = "";
  password = "";
  oncomplete = this.route.snapshot.paramMap.get("oncomplete");

  ngOnInit() {
    if (this.logged_in) this.router.navigate(["/"])
  }

  errorLogin(reason) {
    if (reason == 404) {
      this.snackBar.open(`Silahkan check kembali email kamu`, null, { duration: 5000 });
      this.email = ""
      this.password = ""
    }
    else if (reason == 401) {
      this.snackBar.open(`Password salah!`, null, { duration: 5000 });
      this.password = ""
    }
  }

  async login() {
    console.log(this.password);

    var res = await this.http.post("http://localhost:3000/api/user/login", { email: this.email, password: this.password }).toPromise() as any;
    if (!res.success && res.reason == 403) {
      await sessionStorage.setItem("activate_id", res.id)
      this.router.navigate(['activate'])
    }
    else if (!res.success) return this.errorLogin(res.reason /*404 = not found, 401 = unauthorized (wrong pass) */);
    sessionStorage.setItem("_id", res.id)
    if (this.oncomplete) this.router.navigateByUrl(this.oncomplete)
    else window.location.reload()
  }

  register() {
    this.router.navigate(['register'])
  }
}
