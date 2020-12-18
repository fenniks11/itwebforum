import { Component, Input, NgModule } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

var _acceptedExt = [".png", ".pjp", ".jpg", ".pjpeg", ".jpeg", ".jfif"]

@Component({
  selector: 'profile',
  templateUrl: './profile.html',
  //   styleUrls: ["profile.css"]
})
export class Profile {
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) { };
  err = false;
  fresh = this.route.snapshot.paramMap.get("fresh");
  id = sessionStorage.getItem("_id").toString();
  logged_in = !sessionStorage.getItem("_id") ? false : true;
  not_found = false;
  username_err = "";
  details = {nama: ""} as any;
  org_username: string;
  org_pic: String;
  new_pic: any;
  picture_changed = false;
  default_pic = true;


  async ngOnInit() {
    if (!this.logged_in) return this.router.navigate(['login', { oncomplete: this.router.url }]);
    this.details = (await this.http.post('http://localhost:3000/api/user/get', { id: this.id }).toPromise());

    if (!this.details.found) {
      sessionStorage.clear();
      return this.router.navigate(['login', { oncomplete: this.router.url }]);
    }
    if (!this.details.username) this.details.username = this.details.email
    this.org_username = this.details.username
    this.org_pic = this.details.profile_picture;
    if (!this.details.profile_picture.includes("default")) this.default_pic = false;
  }

  img_prev(inp) {
    if (!inp.target || !inp.target.files[0]) { this.picture_changed = false; this.details.profile_picture = this.org_pic; return };
    this.picture_changed = true;
    this.new_pic = inp.target.files[0]
    var reader = new FileReader();
    reader.onload = (e) => { this.details.profile_picture = e.target.result; }
    reader.readAsDataURL(inp.target.files[0]); // convert to base64 string
  }

  async username_change() {
    console.log(this.details.username);
    if (this.details.username.length < 3) return this.username_err = "Username tidak boleh kurang dari 3 huruf!"
    if(this.org_username == this.details.username) return this.username_err = ""

    let check = (await this.http.post('http://localhost:3000/api/user/check', { email: "0", username: this.details.username }).toPromise()) as any;
    if (check.found) this.username_err = "Username sudah terpakai!"
    else this.username_err = ""

  }

  async pp_change() {
    var formData = new FormData();
    formData.append('uploads[]', this.new_pic, this.new_pic.name)
    var resp = (await this.http.post('http://localhost:3000/api/user/picture_up/' + this.id, formData).toPromise())
    window.location.reload()
    // resp = url ke profile picture yang baru; resp = "Fail" artinya gagal
  }

  async pp_delete() {
    var resp = (await this.http.post('http://localhost:3000/api/user/picture_delete', { id: this.id }).toPromise())
    // resp = url ke profile picture yang default
    window.location.reload()
  }

  async save() {
    if (this.details.username.length < 4) this.details.username = this.details.email.toLowerCase().split("@").shift()
    var resp = await this.http.post('http://localhost:3000/api/user/change', { id: this.id, details: this.details }).toPromise()
    window.location.reload()
  }

}


/**
 *
 * TODO NEXT:
 *
 * ubah fungsi yang harus login menjadi disabled / show toast or info
 *
 * tambah laman profile dan image profile
 *
 */