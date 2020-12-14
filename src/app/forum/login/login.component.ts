import { Component, NgModule } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  //   styleUrls: ["login.css"]
})
export class Login {
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) { };
  wrong = false;
  logged_in = !sessionStorage.getItem("_id") ? false : true;
  email = "";
  password = "";
  oncomplete = this.route.snapshot.paramMap.get("oncomplete");
  ngOnInit() {
    if (this.logged_in) this.router.navigate(["/"])
  }
  async login() {
    var res = await this.http.post("http://localhost:3000/api/user/login", { email: this.email, password: this.password }).toPromise() as any;
    if (!res.success) { alert(res.reason /*404 = not found, 401 = unauthorized (wrong pass) */); alert(this.password); this.email = this.email = this.password = ""; return }
    sessionStorage.setItem("_id", res.id)
    if(this.oncomplete) this.router.navigateByUrl(this.oncomplete)
    else window.location.reload()
  }
  register() {
    this.router.navigate(['register'])
  }
}
