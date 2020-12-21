import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'list-question',
  templateUrl: './list-question.html'
})
export class ListQuestion {
  panelOpenState = false;
  @Input() public titleHeader: string;

  listQnA = [];
  body = { idQnA: '' };
  _id = '';
  page = [1];
  crnPage = 1;
  filterIn = ""

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar, private window: Window, private route: ActivatedRoute) { }

  async ngOnInit() {
    window.localStorage.setItem("activeTitle", "Daftar Pertanyaan")
    this.listQnA = (await this.http
      .get('http://localhost:3000/api/qna/list')
      .toPromise()) as any[];

    var filter = this.route.snapshot.paramMap.get("show");
    if (filter) {
      for (let i = this.listQnA.length - 1; i >= 0; i--) {
        if(this.listQnA[i].category != filter) this.listQnA.splice(i, 1)
      }
    }

    this._id = sessionStorage.getItem('_id') == null ? "0" : sessionStorage.getItem('_id');


    this.page = [1]
    for (let index = 1; index < Math.ceil(this.listQnA.length / 5); index) {
      this.page.push(++index)
    }
  }

  tambah() {
    this.router.navigate(['qna/tambah'], { skipLocationChange: true })
  }

  buka(id) {
    this.router.navigate(['qna/buka/'+id]);
  }

  edit(id) {
    this.router.navigate(['qna/edit', { id: id }], {
      skipLocationChange: true,
    });
  }

  async filter(show) {
    if (show == "_empty") this.router.navigate(['qna'])
    else this.router.navigate(['qna', { show: show }], {})
    this.ngOnInit()
    // window.location.reload()
  }

  async hapus(idQnA) {
    this.body.idQnA = idQnA;
    await this.http
      .post('http://localhost:3000/api/qna/hapus', this.body)
      .toPromise();
    this.ngOnInit();
  }

  async next_page(page) {
    this.crnPage = page
  }

  alertHapus(id, nama) {
    this.snackBar.open(`Hapus pertanyaan "${nama}"?`, "Hapus", { duration: 5000 })
      .onAction().subscribe(() => {
        this.hapus(id)
      });
  }

  async like(id) {
    if (!this._id) {
      this.snackBar.open(`Kamu harus login terlebih dahulu`, "Login", { duration: 5000 })
        .onAction().subscribe(() => { this.router.navigate(["login"]) });
      return;
    }

    await this.http.post('http://localhost:3000/api/qna/like', { arr: [id, this._id] }).toPromise()
    window.location.reload()

  }
}
