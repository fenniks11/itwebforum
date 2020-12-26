import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HeaderForum } from '../../home/header/header.component';
import { TimeVerbose } from 'src/app/time.component';



@Component({
  selector: 'list-forum',
  templateUrl: './list-forum.html',
  styleUrls: ["list-forum.css"]
})
export class ListForum {
  panelOpenState = false;
  @Input() public titleHeader: string;

  showRightBar = false;
  listForum = [];
  body = { idForum: '' };
  _id = '';
  show = 5;
  inputShow = 5;
  page = [1];
  crnPage = 1;
  
  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar, private timeVerbose: TimeVerbose) { }
  
  async ngOnInit() {

    window.localStorage.setItem("activeTitle", "Daftar Forum")
    this.listForum = (await this.http
      .get('http://localhost:3000/api/forum/list')
      .toPromise()) as any[];

    this._id = sessionStorage.getItem('_id') == null ? "0" : sessionStorage.getItem('_id');

    this.page = [1]
    for (let index = 1; index < Math.ceil(this.listForum.length / this.show); index) {
      this.page.push(++index)
    }
    if(this.crnPage > this.page.length) this.crnPage = this.page.length
    
  }

  pagination(show, manual = false){
    this.show = show;
    this.ngOnInit()
    if(manual) return false;
    
  }

  showFilters() {
    console.log(this.showRightBar);
    
    if (this.showRightBar == true) {
      this.showRightBar = false
      document.querySelector("#mainbox").classList.remove("row")
      document.querySelector("#listbox").classList.remove("col-md-9")
    } 
    else if (this.showRightBar == false){
      this.showRightBar = true
      document.querySelector("#mainbox").classList.add("row")
      document.querySelector("#listbox").classList.add("col-md-9")
    }


  }

  getDate(ms){
    return this.timeVerbose.parseTime(ms).verbose[5]
  }

  tambah() {
    this.router.navigate(['forum/tambah'], { skipLocationChange: true })
  }
  buka(id) {
    this.router.navigate(['forum/buka/'+id]);
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
    if (this._id == "0") {
      this.snackBar.open(`Kamu harus login terlebih dahulu`, "Login", { duration: 5000 })
        .onAction().subscribe(() => { this.router.navigate(["login"]) });
      return;
    }

    await this.http.post('http://localhost:3000/api/forum/like', { arr: [id, this._id] }).toPromise();
    window.location.reload()
  }
}
