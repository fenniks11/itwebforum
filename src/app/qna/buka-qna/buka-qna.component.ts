import { Component, ViewEncapsulation, AfterViewChecked } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog } from '@angular/material/dialog';
import { HighlightService } from 'src/app/prism.component';
import { TimeVerbose } from 'src/app/time.component';
import { EditAnswer } from './edit-answer/edit-answer.component';
import { PilihAnswer } from './pilih-answer/pilih-answer.component';
import { BanQnA } from './ban-qna/ban-qna.component';
import { ReportQnA } from './report-qna/report-qna.component';
import { ReportAnswer } from './report-answer/report-answer.component';
import { BanAnswer } from './ban-answer/ban-answer.component';



@Component({
    selector: 'buka-qna',
    templateUrl: './buka-qna.html',
    styleUrls: ["buka-qna.css", "../../../../node_modules/prismjs/themes/prism-okaidia.css", "../../../../node_modules/prismjs/plugins/toolbar/prism-toolbar.css"],
    encapsulation: ViewEncapsulation.None
})
export class BukaQnA implements AfterViewChecked {

    root = { route: "/qna", name: "Question N Answer" }

    id = "";
    _id = sessionStorage.getItem("_id");
    logged_in = !sessionStorage.getItem("_id") ? false : true;
    show = 5;
    isiKirim = {
        id_op: "",
        isi_answer: "",
        idAnswer: null
    }
    metadata = {
        // pesanUtama: "",
        // originalPoster: "",
        // idOP: "",
        // judul: "",
        // ProfilePicture: "",
        // lastEdited: null
    } as any;
    komentar = {
        status: false,
        idOP: "",
        idAnswer: "",
        isiComment: ""
    }
    listKomentar = [] as any;
    body = { arr: [], idAnswer: "" }
    listAnswer = [];
    ban = {} as any;
    metadataQnA = [];
    page = [1];
    crnPage = 1;
    notFound = 0;
    focusTo = 0;
    asker = false;
    hasAnswered = 0;
    chosenAnswer = 0;
    answer_date = 0;
    is_admin = false;
    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar,
        private clipboard: Clipboard,
        private highlightService: HighlightService,
        private timeVerbose: TimeVerbose,
        public dialog: MatDialog
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
            xhr.open('POST', 'http://localhost:3000/api/qna/img_answer');

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

    async ngOnInit(id, reFocus = true) {

        if (!id || this.id.length < 1) {
            this.id = this.route.snapshot.paramMap.get("id");
        }


        let adminCheck = (await this.http.post('http://localhost:3000/api/admin/check', { id: this._id }).toPromise()) as any;
        adminCheck.isAdmin ? this.is_admin = true : 0;


        this.body.arr = [this.id, this._id]
        try { this.metadataQnA = (await this.http.post('http://localhost:3000/api/qna/metadata', this.body).toPromise()) as any[]; }
        catch (err) { if (err) return this.notFound = 1; }


        for (let ph of this.metadataQnA) {
            this.metadata.judul = ph.namaQnA
            this.metadata.pesanUtama = ph.pesanUtama
            this.metadata.originalPoster = ph.originalPoster
            this.metadata.idOP = ph.idOP
            this.metadata.ProfilePicture = ph.ProfilePicture
            this.metadata.lastEdited = ph.lastEdited
            this.chosenAnswer = ph.resolve_answer
            this.answer_date = ph.resolved_date
            this.metadata.createdDate = ph.createdDate
            if (ph.idOP == this._id) this.asker = true;
            this.ban = ph.ban;
        }

        if (!this.ban.status) {
            this.listAnswer = (await this.http.post('http://localhost:3000/api/qna/answer/list', this.body).toPromise()) as any[];

            this.page = [1]
            for (let index = 1; index < Math.ceil(this.listAnswer.length / this.show); index) {
                this.page.push(++index)
            }
            if (this.crnPage > this.page.length) this.crnPage = this.page.length

            for (let v of this.listAnswer) if (v.idOP == this._id) this.hasAnswered = v.idAnswer;

            this.focusTo = parseInt(window.location.hash.replace("#", ""));


            if (this.focusTo && reFocus) this.focus(this.focusTo)
        }
    }

    async banQnA() {

        var temp = await this.http
            .post('http://localhost:3000/api/qna/metadata', this.body)
            .toPromise() as any[];
        var data = temp[0] as any;
        data._id = this._id;

        const dialogRef = this.dialog.open(BanQnA, {
            width: '80%',
            data: this.metadata
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;
            this.http.post("http://localhost:3000/api/admin/ban/qna", { uid: this._id, id: this.id, reason: result }).toPromise();
            window.location.reload()
        });

    }

    async reportQnA() {
        var temp = await this.http
            .post('http://localhost:3000/api/qna/metadata', this.body)
            .toPromise() as any[];
        var data = temp[0] as any;
        data._id = this._id;

        const dialogRef = this.dialog.open(ReportQnA, {
            width: '80%',
            data: this.metadata
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;            
            console.log(result);
            
            this.http.post("http://localhost:3000/api/admin/report", { type: "qna", uid: this._id, id: this.id, reason: result }).toPromise();
            this.snackBar.open(`Terimakasih atas laporannya. Staff akan segera mencheck pertanyaan ini.`, null, { duration: 3000 })
        });
    }

    async reportAnswer(id) {
        var temp = await this.http
            .post('http://localhost:3000/api/answer/metadata', { idAnswer: id })
            .toPromise() as any[];
        var data = temp[0] as any;
        data._id = this._id;

        const dialogRef = this.dialog.open(ReportAnswer, {
            width: '80%',
            data: data
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;
            console.log(result);

            this.http.post("http://localhost:3000/api/admin/report", { type: "answer", uid: this._id, id: id, reason: result }).toPromise();
            this.snackBar.open(`Terimakasih atas laporannya. Staff akan segera mencheck jawaban ini.`, null, { duration: 3000 })
        });
    }

    async banAnswer(id) {

        var temp = await this.http
            .post('http://localhost:3000/api/answer/metadata', { idAnswer: id })
            .toPromise() as any[];
        var data = temp[0] as any;
        data._id = this._id;

        const dialogRef = this.dialog.open(BanAnswer, {
            width: '80%',
            data: data
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;
            this.http.post("http://localhost:3000/api/admin/ban/answer", { uid: this._id, id: id, reason: result }).toPromise();
            window.location.reload()
        });

    }


    focus(focusTo) {
        this.router.navigate(['../qna/buka/' + this.id]);

        var i = 1, r = 0;
        for (let v of this.listAnswer) {
            if (v.idAnswer == focusTo) r = i;
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
        this.body.arr = [this.id, this.isiKirim.isi_answer, this.isiKirim.id_op]
        await this.http.post("http://localhost:3000/api/qna/answer/tambahanswer", this.body).toPromise();
        this.isiKirim.isi_answer = "";
        this.isiKirim.id_op = "";
        this.isiKirim.idAnswer = null;
        this.ngOnInit(this.id);
        this.crnPage = this.page.length
    }
    async hapus(id) {
        this.body.idAnswer = id;
        await this.http
            .post('http://localhost:3000/api/answer/hapus', this.body)
            .toPromise();
        this.ngOnInit(this.id);
    }

    async edit(id) {
        this.body.idAnswer = id;
        var temp = await this.http
            .post('http://localhost:3000/api/answer/metadata', this.body)
            .toPromise() as any[];

        const dialogRef = this.dialog.open(EditAnswer, {
            width: '80%',
            data: { jawaban: temp[0].isiAnswer }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result) return;
            this.confirm_edit(temp[0].idAnswer, result, temp[0].idOP)
        });
    }

    async confirm_edit(idAnswer, isiAnswer, idOP) {
        this.body.arr = [this.id, idAnswer, isiAnswer, idOP, this._id]

        await this.http
            .post('http://localhost:3000/api/answer/edit', this.body)
            .toPromise() as any[];
        this.isiKirim.isi_answer = "";
        this.isiKirim.id_op = "";
        this.isiKirim.idAnswer = null;
        this.ngOnInit(this.id)
    }

    async next_page(page) {
        this.crnPage = page
    }

    alertHapus(id) {
        this.snackBar.open(`Hapus jawaban ini?`, "Hapus", { duration: 5000 })
            .onAction().subscribe(() => {
                this.hapus(id)
            });
    }

    verboseTime(time) {
        return this.timeVerbose.parseTime(time).verbose[5]
    }

    back() {
        this.router.navigate(['../qna'])
    }


    copylink(idAnswer) {
        this.snackBar.open(`Link answer berhasil tersimpan di clipboard kamu!`, null, { duration: 3000 })
        var link = `${window.location.host}/qna/buka/${this.id}#${idAnswer}`
        this.clipboard.copy(link)
    }




    async commentBar(id, refresh = false) {
        if (!this.komentar.status || refresh) { /**jika komentar tertutup */
            this.komentar.status = true
            this.listKomentar = [] as any;
            document.getElementById(`comment-bar-overlay`).style.width = "100%"
            document.getElementById(`comment-bar`).style.width = "500px"
            this.komentar.idAnswer = id;
            try { this.listKomentar = (await this.http.post('http://localhost:3000/api/qna/answer/comment/list', { idAnswer: id }).toPromise()) as any[]; }
            catch (err) { }
            finally {
                console.log(this.listKomentar);
            }

        }
        else {
            this.komentar.status = false
            this.komentar.isiComment = ""
            document.getElementById(`comment-bar-overlay`).style.width = "0%"
            document.getElementById(`comment-bar`).style.width = "0px"


        }

    }

    editQnA() {
        this.router.navigate(['qna/edit', { id: this.id }], {
            skipLocationChange: true,
        });
    }

    async comment() {
        this.body.arr = [this.komentar.idAnswer, this.komentar.isiComment, this._id]
        await this.http.post("http://localhost:3000/api/qna/answer/comment/tambahcomment", this.body).toPromise();
        this.komentar.isiComment = ""
        this.commentBar(this.komentar.idAnswer, true)
    }


    async vote(id, vote) {

        var body = { idAnswer: id, idUser: this._id, vote: vote };
        (await this.http.post("http://localhost:3000/api/qna/answer/vote", body).toPromise()) as any[];
        this.ngOnInit(this.id, false)

    }

    async unvote(id) {
        var body = { idAnswer: id, idUser: this._id };
        (await this.http.post("http://localhost:3000/api/qna/answer/unvote", body).toPromise()) as any[];
        this.ngOnInit(this.id, false)
    }

    async resolveAnswer(id) {
        this.body.idAnswer = id;

        var temp = await this.http
            .post('http://localhost:3000/api/answer/metadata', this.body)
            .toPromise() as any[];
        var data = temp[0] as any;
        data._id = this._id;

        const dialogRef = this.dialog.open(PilihAnswer, {
            width: '80%',
            data: data
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;
            var body = { idAnswer: id, user_id: this._id, idQnA: this.id };
            (await this.http.post("http://localhost:3000/api/qna/resolve", body).toPromise()) as any[];
            window.location.reload()
        });

    }

    toPickedAnswer() {
        this.focus(this.chosenAnswer)
    }

    toLogin() { this.router.navigate(['login']) }

}

/**
 * 1 orang = 1 jawaban
 * yang memberi jawaban tidak bisa upvote / downvote jawaban mereka sendiri
 * pengaju pertanyaan dapat memilih jawaban yang benar
 * sortir berdasarkan nilai
 * nilai = upvote - downvote
 *
 * upvote / downvote sebuah jawaban hanya bisa 1x per user, dan dapat di retract / unvote
 *
 *
 * tab komentar dari sisi kanan
 * tab komentar tidak dapat mengirim gambar
 *
 *
 * list.vote = {
 * score: int
 * list: {
 * ...
 * {_id: {up: boolean}}
 * ...
 *
 * }}
 */