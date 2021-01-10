import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimeVerbose } from 'src/app/time.component';
import { TagifyService } from "../../tagify.service";



@Component({
  selector: 'list-question',
  templateUrl: './list-question.html',
  styleUrls: ["list-question.css"]
})
export class ListQuestion {
  panelOpenState = false;
  @Input() public titleHeader: string;

  showRightBar = false;
  listQnA = [];
  body = { idQnA: '' };
  _id = '';
  page = [1];
  show = 5;
  tagify: any;
  tagsLoaded = false;
  tags = [] as any;
  inputShow = 5;
  crnPage = 1;
  tagFilter = [] as any;
  filterIn = ""

  showType = "_empty"

  sortDesc = false;
  sortBy = "date"

  public TagifySettings = {

    enforceWhitelist: true,
    whitelist: [],
    placeholder: "Ketik sebuah tag",
    maxTags: 5,
    dropdown: {
      maxItems: 20,
      position: "input",      // <- mixumum allowed rendered suggestions
      classname: "tags-look", // <- custom classname for this dropdown, so it could be targeted
      enabled: 1
    }
  };

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar, private window: Window, private route: ActivatedRoute, private timeVerbose: TimeVerbose, private Tagify: TagifyService) { }

  async ngOnInit() {

    window.localStorage.setItem("activeTitle", "Daftar Pertanyaan")



    this.listQnA = (await this.http
      .get('http://localhost:3000/api/qna/list')
      .toPromise()) as any[];

    if (!this.tagsLoaded) {
      var tag = (await this.http
        .get('http://localhost:3000/api/tags/list')
        .toPromise()) as any[];

      this.TagifySettings = { ...this.TagifySettings, whitelist: tag }
      this.tagsLoaded = true
    }



    this.showType = this.route.snapshot.paramMap.get("show") ? this.route.snapshot.paramMap.get("show") : "_empty"
    if (this.showType != "_empty") {
      if (this.showType != "fb" && this.showType != "f" && this.showType != "b") return;
      var filter = this.showType
      for (let i = this.listQnA.length - 1; i >= 0; i--) {
        if (this.listQnA[i].category != filter) this.listQnA.splice(i, 1)
      }
    }

    if (this.tagFilter.length > 0) {
      for (let i = this.listQnA.length - 1; i >= 0; i--) { //list loop
        var obj = this.listQnA[i].tags

        var check = this.tagFilter.every((el) => {
          return obj.indexOf(el) !== -1;
        });

        if (!check) this.listQnA.splice(i, 1)
      }
    }

    this._id = sessionStorage.getItem('_id') == null ? "0" : sessionStorage.getItem('_id');

    this.sortBy =  this.route.snapshot.paramMap.get("sort") ? this.route.snapshot.paramMap.get("sort") : "date";

      this.listQnA.sort((a, b) => {

        if (this.sortBy == "date") {
          if (!this.sortDesc) return b.createdDate - a.createdDate
          else return a.createdDate - b.createdDate
        }

        else if (this.sortBy == "like") {
          if (!this.sortDesc) return b.liked.length - a.liked.length
          else return a.liked.length - b.liked.length
        }

        else if (this.sortBy == "reply") {
          if (!this.sortDesc) return b.responses - a.responses
          else return a.responses - b.responses
        }

        else if (this.sortBy == "view") {
          if (!this.sortDesc) return b.viewed.length - a.viewed.length
          else return a.viewed.length - b.viewed.length
        }

        else return a.createdDate - b.createdDate
      })

    


    this.page = [1]
    for (let index = 1; index < Math.ceil(this.listQnA.length / this.show); index) {
      this.page.push(++index)
    }
    if (this.crnPage > this.page.length) this.crnPage = this.page.length

  }


  tagChange(event) {
    if (event.target.value.length < 1) { this.tagFilter = []; this.ngOnInit(); return }

    let temp = [], obj = JSON.parse(event.target.value)
    for (let i = 0; i < obj.length; i++) {
      temp.push(obj[i]["idTag"])
    }
    this.tagFilter = temp
    this.ngOnInit()
  }


  getDate(ms) {
    return this.timeVerbose.parseTime(ms).verbose[5]
  }

  pagination(show, manual = false) {
    this.show = show;
    this.ngOnInit()
    if (manual) return false;

  }


  showFilters() {
    console.log(this.showRightBar);

    if (this.showRightBar == true) {
      this.showRightBar = false
      document.querySelector("#mainbox").classList.remove("row")
      document.querySelector("#listbox").classList.remove("col-md-9")
    }
    else if (this.showRightBar == false) {
      this.showRightBar = true
      document.querySelector("#mainbox").classList.add("row")
      document.querySelector("#listbox").classList.add("col-md-9")
    }


  }

  tambah() {
    this.router.navigate(['qna/tambah'], { skipLocationChange: true })
  }

  buka(id) {
    this.router.navigate(['qna/buka/' + id]);
  }

  edit(id) {
    this.router.navigate(['qna/edit', { id: id }], {
      skipLocationChange: true,
    });
  }

  searchTag(value) {
    this.router.navigate(['search', { keywords: "tag:" + value }])
  }

  filter(show) {
    this.showType = show
    this.router.navigate(['qna', { show: this.showType, sort: this.sortBy }])
    this.ngOnInit()
  }

  sort(sort) {
    this.sortBy = sort;
    this.router.navigate(['qna', { show: this.showType, sort: this.sortBy }])
    this.ngOnInit()
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
    if (this._id == "0" || !this._id) {
      this.snackBar.open(`Kamu harus login terlebih dahulu`, "Login", { duration: 5000 })
        .onAction().subscribe(() => { this.router.navigate(["login"]) });
      return;
    }

    await this.http.post('http://localhost:3000/api/qna/like', { arr: [id, this._id] }).toPromise()
    window.location.reload()

  }
}


/**
 *
 * send baby clothes to sis ria from kantor pos indonesia before 12 pm
 *
 * 
 * 
 */