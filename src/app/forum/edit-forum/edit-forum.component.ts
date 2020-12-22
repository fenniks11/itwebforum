import { Component, NgModule } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HeaderForum } from '../../home/header/header.component';

@Component({
    selector: 'edit-forum',
    templateUrl: './edit-forum.html',
})
export class EditForum {
    id = "";
    placeholder = [];
    pesan_utama = "";
    nama_baru = "";
    logged_in = !sessionStorage.getItem("_id") ? false : true;
    idOP = "";
    body = { arr: [] }
    body1 = { arr: [] }
    constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

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
    
    async ngOnInit() {
        if (sessionStorage.getItem("_id") == null) return this.router.navigate(['/'])
        HeaderForum.prototype.titleHeader = "Edit forum?"
        this.id = this.route.snapshot.paramMap.get("id")
        this.body.arr.push(this.id)
        this.placeholder = (await this.http.post('http://localhost:3000/api/forum/metadata', this.body).toPromise()) as any[];
        for (let ph of this.placeholder) {
            this.pesan_utama = ph.pesanUtama;
            this.nama_baru = ph.namaForum;
            this.idOP = ph.idOP;
        }
    }
    kirim() {
        this.body1.arr = [this.id, this.nama_baru, this.idOP, this.pesan_utama]
        this.http.post("http://localhost:3000/api/forum/edit", this.body1).toPromise();
        this.router.navigate(['forum'], { skipLocationChange: true })
    }

    toLogin() { this.router.navigate(['login']) }


}

