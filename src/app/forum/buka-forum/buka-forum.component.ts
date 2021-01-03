import { Component, ViewEncapsulation, AfterViewChecked } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog } from '@angular/material/dialog';
import { HighlightService } from 'src/app/prism.component';
import { TimeVerbose } from 'src/app/time.component';
import { EditPesan } from './edit-answer/edit-pesan.component';
import { BanForum } from './ban-forum/ban-forum.component';
import { ReportForum } from './report-forum/report-forum.component';
import { BanPesan } from './ban-pesan/ban-pesan.component';
import { ReportPesan } from './report-pesan/report-pesan.component';




@Component({
    selector: 'buka-forum',
    templateUrl: './buka-forum.html',
    styleUrls: ["buka-forum.css", "../../../../node_modules/prismjs/themes/prism-okaidia.css", "../../../../node_modules/prismjs/plugins/toolbar/prism-toolbar.css"],
    encapsulation: ViewEncapsulation.None
})
export class BukaForum implements AfterViewChecked {

    root = { route: "/forum", name: "Forum" }

    id = "";
    _id = sessionStorage.getItem("_id");
    logged_in = !sessionStorage.getItem("_id") ? false : true;
    is_admin = false;
    ban = {} as any;
    show = 5;
    isiKirim = {
        id_op: "",
        isi_pesan: "",
        idPesan: null
    }
    metadata = {
        // pesanUtama: "",
        // originalPoster: "",
        // idOP: "",
        // judul: "",
        // ProfilePicture: "",
        // lastEdited: null
    } as any;
    body = { arr: [], idPesan: "" }
    listPesan = [];
    metadataForum = [];
    page = [1];
    crnPage = 1;
    notFound = 0;
    focusTo = 0;

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar,
        private clipboard: Clipboard,
        private highlightService: HighlightService,
        public dialog: MatDialog,
        private timeVerbose: TimeVerbose
    ) { }

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

    ngAfterViewChecked() {
        this.highlightService.start((toCompiler) => {
            toCompiler.newTab ?
                window.open(`${window.location.protocol}//${window.location.host}/compilerun;lang=${toCompiler.lang};code=${toCompiler.code}`) :
                this.router.navigate(["compilerun", { lang: toCompiler.lang, code: toCompiler.code }])
        });

        console.clear()
    }


    async ngOnInit(id) {

        if (!id || this.id.length < 1) {
            this.id = this.route.snapshot.paramMap.get("id");
        }

        let adminCheck = (await this.http.post('http://localhost:3000/api/admin/check', { id: this._id }).toPromise()) as any;
        adminCheck.isAdmin ? this.is_admin = true : 0;


        this.body.arr = [this.id, this._id]
        try { this.metadataForum = (await this.http.post('http://localhost:3000/api/forum/metadata', this.body).toPromise()) as any[]; }
        catch (err) { if (err) return this.notFound = 1; }

        for (let ph of this.metadataForum) {
            this.metadata.judul = ph.namaForum
            this.metadata.pesanUtama = ph.pesanUtama
            this.metadata.originalPoster = ph.originalPoster
            this.metadata.idOP = ph.idOP
            this.metadata.ProfilePicture = ph.ProfilePicture
            this.metadata.lastEdited = ph.lastEdited
            this.metadata.createdDate = ph.createdDate
            this.ban = ph.ban;
        }


        if (!this.ban.status) {
            this.listPesan = (await this.http.post('http://localhost:3000/api/forum/pesan/list', this.body).toPromise()) as any[];


            this.page = [1]
            for (let index = 1; index < Math.ceil(this.listPesan.length / this.show); index) {
                this.page.push(++index)
            }
            if (this.crnPage > this.page.length) this.crnPage = this.page.length

            this.focusTo = parseInt(window.location.hash.replace("#", ""));


            if (this.focusTo) this.focus(this.focusTo)
        }
    }


    async banForum() {

        var temp = await this.http
            .post('http://localhost:3000/api/forum/metadata', this.body)
            .toPromise() as any[];
        var data = temp[0] as any;
        data._id = this._id;

        const dialogRef = this.dialog.open(BanForum, {
            width: '80%',
            data: this.metadata
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;
            this.http.post("http://localhost:3000/api/admin/ban/forum", { uid: this._id, id: this.id, reason: result }).toPromise();
            window.location.reload()
        });

    }

    async banPesan(id) {

        var temp = await this.http
            .post('http://localhost:3000/api/pesan/metadata', { idPesan: id })
            .toPromise() as any[];
        var data = temp[0] as any;
        data._id = this._id;

        const dialogRef = this.dialog.open(BanPesan, {
            width: '80%',
            data: data
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;
            this.http.post("http://localhost:3000/api/admin/ban/pesan", { uid: this._id, id: id, reason: result }).toPromise();
            window.location.reload()
        });

    }

    async reportForum() {
        var temp = await this.http
            .post('http://localhost:3000/api/forum/metadata', this.body)
            .toPromise() as any[];
        var data = temp[0] as any;
        data._id = this._id;

        const dialogRef = this.dialog.open(ReportForum, {
            width: '80%',
            data: this.metadata
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;
            console.log(result);

            this.http.post("http://localhost:3000/api/admin/report", { type: "forum", uid: this._id, id: this.id, reason: result }).toPromise();
            this.snackBar.open(`Terimakasih atas laporannya. Staff akan segera mencheck forum ini.`, null, { duration: 3000 })
        });
    }

    async reportPesan(id) {
        var temp = await this.http
            .post('http://localhost:3000/api/pesan/metadata', { idPesan: id })
            .toPromise() as any[];
        var data = temp[0] as any;
        data._id = this._id;

        const dialogRef = this.dialog.open(ReportPesan, {
            width: '80%',
            data: data
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;
            console.log(result);

            this.http.post("http://localhost:3000/api/admin/report", { type: "pesan", uid: this._id, id: id, reason: result }).toPromise();
            this.snackBar.open(`Terimakasih atas laporannya. Staff akan segera mencheck pesan ini.`, null, { duration: 3000 })
        });
    }

    focus(focusTo) {
        this.router.navigate(['../forum/buka/' + this.id]);

        var i = 1, r = 0;
        for (let v of this.listPesan) {
            if (v.idPesan == focusTo) r = i;
            else i++
        }

        if (r) {
            this.crnPage = Math.ceil(r / this.show)
            setTimeout(() => {
                document.getElementById(`${focusTo}`).style.animation = ""
            }, 250);
            setTimeout(() => {
                window.location.hash = `#${focusTo}`
                document.getElementById(`${focusTo}`).style.animation = "fadeIn ease 5s"
            }, 500);
        }
        else {
            this.snackBar.open(`Wah, sepertinya kamu menginput tag jawaban yang sudah tidak ada :(`, "Ok")
                .onAction().subscribe(() => {
                    this.snackBar.dismiss()
                });
        }
    }

    async kirim() {
        this.isiKirim.id_op = this._id;
        this.body.arr = [this.id, this.isiKirim.isi_pesan, this.isiKirim.id_op]
        await this.http.post("http://localhost:3000/api/forum/pesan/tambahpesan", this.body).toPromise();
        this.isiKirim.isi_pesan = "";
        this.isiKirim.id_op = "";
        this.isiKirim.idPesan = null;
        this.ngOnInit(this.id);
        this.crnPage = this.page.length
    }
    async hapus(id) {
        this.body.idPesan = id;
        await this.http
            .post('http://localhost:3000/api/pesan/hapus', this.body)
            .toPromise();
        this.ngOnInit(this.id);
    }
    async edit(id) {
        this.body.idPesan = id;
        var temp = await this.http
            .post('http://localhost:3000/api/pesan/metadata', this.body)
            .toPromise() as any[];

        const dialogRef = this.dialog.open(EditPesan, {
            width: '80%',
            data: { pesan: temp[0].isiPesan }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result) return;
            this.confirm_edit(temp[0].idPesan, result, temp[0].idOP)
        });
    }

    async confirm_edit(idPesan, isiPesan, idOP) {
        this.body.arr = [this.id, idPesan, isiPesan, idOP, this._id]

        await this.http
            .post('http://localhost:3000/api/pesan/edit', this.body)
            .toPromise() as any[];
        this.isiKirim.isi_pesan = "";
        this.isiKirim.id_op = "";
        this.isiKirim.idPesan = null;
        this.ngOnInit(this.id)
    }
    async next_page(page) {
        this.crnPage = page
    }
    alertHapus(id) {
        this.snackBar.open(`Hapus pesan?`, "Hapus", { duration: 5000 })
            .onAction().subscribe(() => {
                this.hapus(id)
            });
    }

    editForum() {
        this.router.navigate(['forum/edit', { id: this.id }], {
            skipLocationChange: true,
        });
    }

    verboseTime(time) {
        return this.timeVerbose.parseTime(time).verbose[5]
    }

    back() {
        this.router.navigate(['../forum'])
    }
    async balas(idPesan) {
        this.body.idPesan = idPesan;
        var temp = await this.http
            .post('http://localhost:3000/api/pesan/metadata', this.body)
            .toPromise() as any[];
        for (let ph of temp) this.isiKirim.isi_pesan += `<blockquote cite="${window.location.host}/forum/buka/${this.id}#${ph.idPesan}">${ph.isiPesan}</blockquote> <a href="${window.location.host}/forum/buka/${this.id}#${ph.idPesan}">@${ph.originalPoster}</a>&nbsp;`
        window.location.hash = `#editor`
    }
    copylink(idPesan) {
        this.snackBar.open(`Link pesan berhasil tersimpan di clipboard kamu!`, null, { duration: 3000 })
        var link = `${window.location.host}/forum/buka/${this.id}#${idPesan}`
        this.clipboard.copy(link)
    }

    toLogin() { this.router.navigate(['login']) }

}

