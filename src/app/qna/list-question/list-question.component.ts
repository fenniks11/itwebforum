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
  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar, private window: Window) { }
  async ngOnInit() {
    window.localStorage.setItem("activeTitle", "Daftar Pertanyaan")
    this.listQnA = (await this.http
      .get('http://localhost:3000/api/qna/list')
      .toPromise()) as any[];
    console.log(this.listQnA);

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
    this.router.navigate(['qna/buka', { id: id }]);
  }
  edit(id) {
    this.router.navigate(['qna/edit', { id: id }], {
      skipLocationChange: true,
    });
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
