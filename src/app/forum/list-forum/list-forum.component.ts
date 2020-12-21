import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HeaderForum } from '../../home/header/header.component';



@Component({
  selector: 'list-forum',
  templateUrl: './list-forum.html'
})
export class ListForum {
  panelOpenState = false;
  @Input() public titleHeader: string;

  listForum = [];
  body = { idForum: '' };
  _id = '';
  page = [1];
  crnPage = 1;
  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar, private activatedRoute: ActivatedRoute) { }
  
  async ngOnInit() {
    window.localStorage.setItem("activeTitle", "Daftar Forum")
    this.listForum = (await this.http
      .get('http://localhost:3000/api/forum/list')
      .toPromise()) as any[];
    console.log(this.listForum);

    this._id = sessionStorage.getItem('_id') == null ? "0" : sessionStorage.getItem('_id');

    this.page = [1]
    for (let index = 1; index < Math.ceil(this.listForum.length / 5); index) {
      this.page.push(++index)
    }
    
  }

  getDate(ms){
    return new Date(ms)
  }

  tambah() {
    this.router.navigate(['forum/tambah'], { skipLocationChange: true })
  }
  buka(id) {
    this.router.navigate(['forum/buka', { id: id }]);
  }
  edit(id) {
    this.router.navigate(['forum/edit', { id: id }], {
      skipLocationChange: true,
    });
  }
  async hapus(idForum) {
    this.body.idForum = idForum;
    await this.http
      .post('http://localhost:3000/api/forum/hapus', this.body)
      .toPromise();
    this.ngOnInit();
  }
  async next_page(page) {
    this.crnPage = page
  }

  alertHapus(id, nama) {
    this.snackBar.open(`Hapus forum "${nama}"?`, "Hapus", { duration: 5000 })
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

    await this.http.post('http://localhost:3000/api/forum/like', { arr: [id, this._id] }).toPromise();
    window.location.reload()
  }
}
