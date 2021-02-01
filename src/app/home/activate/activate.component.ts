import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit {
  id: string = "";
  key: string = "";
  email: string = "";
  input_key: string = "";
  errValidate: string = "";
  mail_sent: boolean = false;

  constructor(private router: Router, private http: HttpClient, private snackBar: MatSnackBar) { }

  async ngOnInit() {
    this.id = await sessionStorage.getItem("activate_id")    
    if (!this.id) return this.router.navigate(['login']);
    var res = await this.http.post("http://localhost:3000/api/user/activate_key", { id: this.id }).toPromise() as any;
    this.key = res.key;
    this.email = res.email;
  }

  async send_key() { //send to email
    this.mail_sent = true;
    console.log(this.key);
    alert("Untuk saat ini, kunci berada pada console log di browser kamu.")
  }

  async activate() {
    if (this.key.length < 10) return this.errValidate = "Kunci memiliki 10 karakter";
    else if (this.key != this.input_key) return this.errValidate = "Kunci yang dimasukkan salah";

    var res = await this.http.post("http://localhost:3000/api/user/activation", { id: this.id, key: this.input_key }).toPromise() as any;
    if (!res.success) return this.errValidate = "Kunci yang dimasukkan salah";
    sessionStorage.removeItem("activate_id")
    sessionStorage.setItem("_id", this.id)
    this.snackBar.open(`Memproses...`, null, { duration: 2000 })
    setTimeout(() => this.router.navigate(["profile", { fresh: true }]), 2000);

  }

}
