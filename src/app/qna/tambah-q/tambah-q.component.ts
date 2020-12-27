import { Component, NgModule, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Tagify from "@yaireo/tagify"
import { TagifyService } from "../../tagify.service";



@Component({
  selector: 'tambah-q',
  templateUrl: './tambah-q.component.html',
  styleUrls: ["tambah-q.css"]
})

export class TambahQuestion {
  panelOpenState = false;
  titleHeader
  nama_baru = '';
  id_op = "";
  logged_in = !sessionStorage.getItem("_id") ? false : true;
  pesan_utama = "";
  listForum = [];
  body = {};
  valid = false;
  tagify: any;
  tagsLoaded = false;
  tags = [] as any;
  category = "_empty";
  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar, private Tagify: TagifyService) { };

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
    codesample_languages: [
      { text: 'HTML/XML', value: 'markup' },
      { text: 'NodeJS / JavaScript', value: 'javascript' },
      { text: 'CSS', value: 'css' },
      { text: 'PHP', value: 'php' },
      { text: 'Python', value: 'python' },
      { text: 'Java', value: 'java' },
      { text: 'C', value: 'c' },
      { text: 'C++', value: 'cpp' }
    ],
    images_upload_handler: function (blobInfo, success, failure) {
      var xhr, formData;

      xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      xhr.open('POST', 'http://localhost:3000/api/forum/img_pesan');

      xhr.onload = function () {
        if (xhr.responseText.startsWith("Fail")) return failure(xhr.responseText);
        else success(xhr.responseText);
      };

      formData = new FormData();
      formData.append('file', blobInfo.blob(), blobInfo.filename());

      xhr.send(formData);
    }
  }

  public TagifySettings = {

    enforceWhitelist: true,
    whitelist: [],
    placeholder: "Ketik sebuah tag, minimal 1 tag dan maksimal 5 tag",
    maxTags: 5,
    dropdown: {
      maxItems: 20,           // <- mixumum allowed rendered suggestions
      classname: "tags-look", // <- custom classname for this dropdown, so it could be targeted
      enabled: 1
    }
  };


  tagChange(event) {
    let temp = [], obj = JSON.parse(event.target.value)
    for (let i = 0; i < obj.length; i++) {
      temp.push(obj[i]["idTag"])
    }
    this.tags = temp
  }


 async ngOnInit() {
    if (sessionStorage.getItem("_id") == null) return this.router.navigate(['/'])
    var tag = (await this.http
      .get('http://localhost:3000/api/tags/list')
      .toPromise()) as any[];

    this.TagifySettings = { ...this.TagifySettings, whitelist: tag }
    this.tagsLoaded = true


  }

  async kirim() {


    this.id_op = sessionStorage.getItem("_id")
    this.body = { "arr": [this.nama_baru, this.id_op, this.pesan_utama, this.category, this.tags] };
    var res;
    res = await this.http.post("http://localhost:3000/api/qna/tambah", this.body).toPromise();
    var id = res.id
    this.snackBar.open(`Pertanyaan berhasil dibuat! memindahkan kamu ke pertanyaan...`, null, { duration: 2000 })
    setTimeout(() => {
      this.router.navigate(['qna/buka/' + id])
    }, 2000);
  }

  toLogin() { this.router.navigate(['login']) }


}

