import { Component, NgModule, Input } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';

function backScape(str) {
  return `${str}`
    .replace("&", "&amp;")
    .replace("<", "&lt;")
    .replace(">", "&gt;")
    .replace('"', "&quot;")
    .replace(/(?:\r\n|\r|\n)/g, '<br>')
}

@Component({
  selector: 'compile-run',
  templateUrl: './compilerun.html',
  styleUrls: ["compilerun.css"]
})
export class CompileRun {
  editorOptions = { theme: 'vs-dark', language: 'javascript', minimap: { enabled: false } };
  code: string;
  result = "Ready" as any;
  res_type = "code"
  lang = "njs";
  runtime: string;
  resultType = "Console"
  run_err: boolean;
  loading = false;
  loading_message = "";

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private clipboard: Clipboard, private snackBar: MatSnackBar) { };

  async ngOnInit() {
    if (this.route.snapshot.paramMap.get("code")) this.code = decodeURIComponent(this.route.snapshot.paramMap.get("code"));
    if (this.route.snapshot.paramMap.get("lang")) { this.lang = this.route.snapshot.paramMap.get("lang"); this.languageChange(); }
  }

  languageChange() {
    let lang;
    switch (this.lang) {
      case "html": lang = "php"; break;
      case "njs": lang = "javascript"; break;
      case "jv": lang = "java"; break;
      case "py": lang = "python"; break;
      case "c": lang = "c"; break;
      case "cpp": lang = "cpp"; break;
    }
    this.editorOptions = { ...this.editorOptions, language: lang };
  }

  async compile() {
    this.loading_message = "Menunggu compiler dari server...";
    this.loading = true;
    this.result = null;
    var res;
    if (this.lang == "html") {
      this.resultType = "iFrame"
      res = await this.http.post("http://localhost:3000/api/iframe", { code: this.code }).toPromise() as any;
      this.res_type = "iframe"
      this.result = 'data:text/html;charset=utf-8,' + encodeURI(res.result)
    }
    else {
      this.resultType = "Console"
      res = await this.http.post("http://localhost:3000/api/compile", { lang: this.lang, code: this.code }).toPromise() as any;
      this.res_type = "code"
      this.result = backScape(res.result)
    }

    this.run_err = !res.success

    this.runtime = res.runtime
    this.loading_message = "Compiler selesai";
    this.loading = false;
  }

  async copy() {
    this.snackBar.open(`Link code ini berhasil tersimpan di clipboard kamu!`, null, { duration: 3000 })
    let codes = encodeURIComponent(this.code).replace(/\(/g, "%28").replace(/\)/g, "%29")
    var link = `${window.location.host}/compilerun;lang=${this.lang};code=${codes}`
    this.clipboard.copy(link)
  }
}

