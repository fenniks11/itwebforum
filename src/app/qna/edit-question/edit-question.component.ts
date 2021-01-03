import { Component, NgModule } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TagifyService } from "../../tagify.service";

@Component({
    selector: 'edit-question',
    templateUrl: './edit-question.html',
    styleUrls: ["edit-question.css"]
})
export class EditQuestion {
    id = "";
    placeholder = [];
    pesan_utama = "";
    nama_baru = "";
    logged_in = !sessionStorage.getItem("_id") ? false : true;
    _id = sessionStorage.getItem("_id");
    idOP = "";
    body = { arr: [] }
    body1 = { arr: [] }
    tagify: any;
    tagsLoaded = false;
    tags = [] as any;
    category = "_empty";
    constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private Tagify: TagifyService) { }

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
        this.id = this.route.snapshot.paramMap.get("id")
        this.body.arr.push(this.id)
        this.placeholder = (await this.http.post('http://localhost:3000/api/qna/metadata', this.body).toPromise()) as any[];
        for (let ph of this.placeholder) {
            this.pesan_utama = ph.pesanUtama;
            this.nama_baru = ph.namaQnA;
            this.idOP = ph.idOP;
        }

        var tag = (await this.http
          .get('http://localhost:3000/api/tags/list')
          .toPromise()) as any[];
    
        this.TagifySettings = { ...this.TagifySettings, whitelist: tag }
        this.tagsLoaded = true
    }
    kirim() {
        this.body1.arr = [this.id, this.nama_baru, this.idOP, this.pesan_utama, this.category, this.tags, this._id]
        this.http.post("http://localhost:3000/api/qna/edit", this.body1).toPromise();
        this.router.navigate(['qna'], { skipLocationChange: true })
    }

    toLogin() { this.router.navigate(['login']) }


}

