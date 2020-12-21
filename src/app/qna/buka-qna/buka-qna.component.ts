import { Component, ViewEncapsulation } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog } from '@angular/material/dialog';



@Component({
    selector: 'buka-qna',
    templateUrl: './buka-qna.html',
    styleUrls: ["buka-qna.css"],
    encapsulation: ViewEncapsulation.None
})
export class BukaQnA {
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
    body = { arr: [], idAnswer: "" }
    listAnswer = [];
    metadataQnA = [];
    page = [1];
    crnPage = 1;
    notFound = 0;
    focusTo = 0;
    Edit = false;
    asker = false;
    hasAnswered = 0;
    chosenAnswer = 0;
    answer_date = 0;
    constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, private clipboard: Clipboard) { }

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


    async ngOnInit(id) {

        if (!id || this.id.length < 1) {
            this.id = this.route.snapshot.paramMap.get("id");
        }




        this.body.arr = [this.id]
        try { this.metadataQnA = (await this.http.post('http://localhost:3000/api/qna/metadata', this.body).toPromise()) as any[]; }
        catch (err) { if (err) return this.notFound = 1; }

        this.listAnswer = (await this.http.post('http://localhost:3000/api/qna/answer/list', this.body).toPromise()) as any[];

        for (let ph of this.metadataQnA) {
            this.metadata.judul = ph.namaQnA
            this.metadata.pesanUtama = ph.pesanUtama
            this.metadata.originalPoster = ph.originalPoster
            this.metadata.idOP = ph.idOP
            this.metadata.ProfilePicture = ph.ProfilePicture
            this.metadata.lastEdited = ph.lastEdited
            this.chosenAnswer = ph.resolve_answer
            this.answer_date = ph.resolved_date
            if (ph.idOP == this._id) this.asker = true;
        }


        this.page = [1]
        for (let index = 1; index < Math.ceil(this.listAnswer.length / this.show); index) {
            this.page.push(++index)
        }

        this.focusTo = parseInt(window.location.hash.replace("#", ""));

        for (let v of this.listAnswer) if (v.idOP == this._id) this.hasAnswered = v.idAnswer;


        if (this.focusTo) this.focus(this.focusTo)
    }

    focus(focusTo) {
        this.router.navigate(['../qna/buka', { id: this.id }]);

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
        for (let ph of temp) {
            this.isiKirim.isi_answer = ph.isiAnswer
            this.isiKirim.id_op = ph.idOP
            this.isiKirim.idAnswer = ph.idAnswer
        }
        this.Edit = true;
        this.ngOnInit(this.id);
        window.location.hash = `#editor`
    }

    async confirm_edit() {
        this.body.arr = [this.id, this.isiKirim.idAnswer, this.isiKirim.isi_answer, this.isiKirim.id_op]

        await this.http
            .post('http://localhost:3000/api/answer/edit', this.body)
            .toPromise() as any[];
        this.isiKirim.isi_answer = "";
        this.isiKirim.id_op = "";
        this.isiKirim.idAnswer = null;
        this.Edit = false;
        this.ngOnInit(this.id)
    }

    async next_page(page) {
        this.crnPage = page
    }

    alertHapus(id) {
        this.snackBar.open(`Hapus answer?`, "Hapus", { duration: 5000 })
            .onAction().subscribe(() => {
                this.hapus(id)
            });
    }

    verboseTime(time) {
        return new Date(time).toUTCString()
    }

    back() {
        this.router.navigate(['../qna'])
    }


    copylink(idAnswer) {
        this.snackBar.open(`Link answer berhasil tersimpan di clipboard kamu!`, null, { duration: 3000 })
        var link = `${window.location.host}/qna/buka;id=${this.id}#${idAnswer}`
        this.clipboard.copy(link)
    }

    commentBar(id) {

    }

    async vote(id, vote) {
        var body = { idAnswer: id, idUser: this._id, vote: vote };
        (await this.http.post("http://localhost:3000/api/qna/answer/vote", body).toPromise()) as any[];
        window.location.reload()
    }

    async unvote(id) {
        var body = { idAnswer: id, idUser: this._id };
        (await this.http.post("http://localhost:3000/api/qna/answer/unvote", body).toPromise()) as any[];
        window.location.reload()
    }

    async resolveAnswer(id) {
        this.snackBar.open(`Kamu tidak bisa mencabut jawaban yang terpilih, yakin ini jawabannya?`, "Pilih sebagai jawaban", { duration: 5000 })
            .onAction().subscribe(async () => {
                var body = { idAnswer: id, user_id: this._id, idQnA: this.id };
                (await this.http.post("http://localhost:3000/api/qna/resolve", body).toPromise()) as any[];
                window.location.reload()
            });
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