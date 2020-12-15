import { Component, NgModule } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HeaderForum } from '../header/header.component';

@Component({
  selector: 'forum-baru',
  templateUrl: './tambah-forum.component.html',
})

export class TambahForum {
  panelOpenState = false;
  titleHeader
  nama_baru = '';
  id_op = "";
  logged_in = !sessionStorage.getItem("_id") ? false : true;
  pesan_utama = "";
  listForum = [];
  body = {};
  valid = false;
  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) { };
  public TinyMce = {
    height: 500,
    menubar: false,
    plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code codesample fullscreen',
        'insertdatetime media table paste code help wordcount'
    ],
    toolbar:
        'undo redo | formatselect | codesample bold italic backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | removeformat | link image media | help',

    selector: 'textarea',
    images_upload_handler: function (blobInfo, success, failure) {
        var xhr, formData;

        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open('POST', 'http://localhost:3000/api/forum/img_forum');

        xhr.onload = function () {
            if (xhr.responseText.startsWith("Fail")) return failure(xhr.responseText);
            else success(xhr.responseText);
        };

        formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());

        xhr.send(formData);
    }
}

  ngOnInit(){
    if (sessionStorage.getItem("_id") == null) return this.router.navigate(['/'])
    HeaderForum.prototype.titleHeader = "Tambah forum?"
  }

  async kirim() {

    
    this.id_op = sessionStorage.getItem("_id")
    this.body = { "arr": [this.nama_baru, this.id_op, this.pesan_utama] };
    var res;
    res = await this.http.post("http://localhost:3000/api/forum/tambah", this.body).toPromise();
    var id = res.id
    this.snackBar.open(`Forum berhasil dibuat! memindahkan kamu ke forum...`, null, { duration: 2000 })
    setTimeout(() => {
      this.router.navigate(['forum/buka', { id: id }])  
    }, 2000);
  }

  toLogin() { this.router.navigate(['login']) }

  
}

