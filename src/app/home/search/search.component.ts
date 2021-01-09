import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'search',
    templateUrl: './search.html',
    styleUrls: ["search.css"],
    encapsulation: ViewEncapsulation.None
})
export class Search {
    constructor(private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar, private http: HttpClient) { };
    keywords = !this.route.snapshot.paramMap.get("keywords") ? "" : this.route.snapshot.paramMap.get("keywords");
    wrong = false;
    logged_in = !sessionStorage.getItem("_id") ? false : true;
    types = [];
    result = {} as any;
    resultLength = 0;
    headerSearch = false
    showResult = false;

    /**
     * pencarian forum / pesan JUGA AKAN mencari original poster DARI KEYWORD
     * contoh: ada pesan dengan pengirim Orang1, keyword yang dimasukkan = "orang", pesan dengan pengirim Orang1 akan masuk ke hasil
     * 
     * belum ada fungsi "Sort By" atau "Urutkan Berdasarkan".
     */

    ngOnInit() { if (this.keywords && this.keywords.length >= 3) { this.headerSearch = true; this.types.push("forum", "qna") ;this.cari(true) } }

    errorPrompt(type) {
        this.snackBar.open(type == "keywords" ? `Silahkan masukkan kata kunci minimal 3 karakter` : "Silahkan centang minimal 1 tipe", "Ok", { duration: 5000 })
    }

    async cari(headerSearch = false) {
        if (!this.keywords || this.keywords.length < 3) return this.errorPrompt("keywords");

        if (!headerSearch) {
            this.types = []


            document.querySelectorAll(".types:checked").forEach((value, ndex) => { this.types.push(value.id); })
            if (!this.types.length) return this.errorPrompt("types");
        }
        this.showResult = false;


        var text = this.keywords.split(/ +/g) as [], orgQuery = this.keywords, tags = []

        for (let i = text.length - 1; i >= 0; i--) {
            if (/tag:(.*)/.exec(text[i])) {
                tags.push(/tag:(.*)/.exec(text[i])[1])
                text.splice(i, 1)
            }
        }

        this.keywords = text.join(" ")

        this.result = {} as any;

        this.result = await this.http.post("http://localhost:3000/api/search", { keywords: this.keywords, types: this.types, tags: tags }).toPromise() as any;

        this.keywords = orgQuery

        this.resultLength = 0
        for (const i in this.result) {
            this.resultLength += this.result[i].length
        }

        console.log(this.result);

        this.showResult = true;

    }

    forum(id) {
        this.router.navigate(['forum/buka/' + id]);
    }

    qna(id) {
        this.router.navigate(['qna/buka/' + id]);
    }

    user(username) {

    }

}


/**
 * Next:
 * fitur sortir di list forum dan list qna
 * home page admin panel
 */