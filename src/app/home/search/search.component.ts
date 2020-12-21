import { Component, NgModule } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector: 'search',
    templateUrl: './search.html',
    styleUrls: ["search.css"]
})
export class Search {
    constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) { };
    keywords = !this.route.snapshot.paramMap.get("keywords") ? "" : this.route.snapshot.paramMap.get("keywords");
    wrong = false;
    logged_in = !sessionStorage.getItem("_id") ? false : true;
    types = [];
    headerSearch = false;
    result = [];

    /**
     * pencarian forum / pesan JUGA AKAN mencari original poster DARI KEYWORD
     * contoh: ada pesan dengan pengirim Orang1, keyword yang dimasukkan = "orang", pesan dengan pengirim Orang1 akan masuk ke hasil
     * 
     * belum ada fungsi "Sort By" atau "Urutkan Berdasarkan".
     */

    ngOnInit() {
        if (this.keywords) { if (this.keywords.length < 3) return; this.types.push("forum"); this.types.push("qna"); this.headerSearch = true; this.cari(); }
    }

    async cari() {
        if (!this.keywords || this.keywords.length < 3) return;
        document.querySelectorAll(".types:checked").forEach((value, ndex) => { this.types.push(value.id); })
        if (!this.types.length) return;

        var res = await this.http.post("http://localhost:3000/api/search", { keywords: this.keywords, types: this.types }).toPromise() as any;


        this.result = []
        this.types = []


        for (const i in res) this.result = this.result.concat(res[i])
        // console.log(this.result);

    }

    forum(id) {
        this.router.navigate(['forum/buka/'+id]);
    }

    qna(id) {
        this.router.navigate(['qna/buka/'+id]);
    }

    pesan(fid, id) {
        // localhost:4200/forum/buka;id=1607358733691;msg=3215119914879
        this.router.navigate([`forum/buka/${fid}#${id}`]);
    }

    user(username) {

    }

}
