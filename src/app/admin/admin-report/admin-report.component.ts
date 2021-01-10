import { Component, Input, NgModule } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TimeVerbose } from 'src/app/time.component';
import { BanQnA } from 'src/app/qna/buka-qna/ban-qna/ban-qna.component';
import { MatDialog } from '@angular/material/dialog';
import { BanAnswer } from 'src/app/qna/buka-qna/ban-answer/ban-answer.component';
import { BanForum } from 'src/app/forum/buka-forum/ban-forum/ban-forum.component';
import { BanPesan } from 'src/app/forum/buka-forum/ban-pesan/ban-pesan.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportClose } from './report-close/report-close.component';


@Component({
  selector: 'admin-report',
  templateUrl: './admin-report.html',
  styleUrls: ["admin-report.css"]
})
export class AdminReport {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private timeVerbose: TimeVerbose,
    public dialog: MatDialog) { };

  id = sessionStorage.getItem("_id").toString();
  check = 0;
  unauthorized = false;
  details = {} as any
  reports = [] as any;


  async ngOnInit() {
    if (!this.id) return this.router.navigate(['login', { oncomplete: this.router.url }]);

    this.details = (await this.http.post('http://localhost:3000/api/user/get', { id: this.id }).toPromise());
    this.check = 1;
    if (parseInt(this.details.level) < 90) this.unauthorized = true;

    this.reports = (await this.http.post('http://localhost:3000/api/admin/report/list', { uid: this.id }).toPromise() as any).reports;
    console.log(this.reports);

  }

  verboseTime(ms) {
    return this.timeVerbose.parseTime(ms).verbose[5]
  }

  open(type, id, metadata) {
    switch (type) {
      case "qna": this.router.navigate(['qna/buka/' + id]); break;
      case "forum": this.router.navigate(['forum/buka/' + id]); break;
      case "answer": this.router.navigateByUrl('qna/buka/' + metadata.idQnA + "#" + id); break;
      case "pesan": this.router.navigateByUrl('forum/buka/' + metadata.idForum + "#" + id); break;
    }
  }

  getResponse(idReport) {

    const dialogRef = this.dialog.open(ReportClose, {
      width: '80%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) return;
      this.closeCase(idReport, result);
    });

  }

  chat() {
    this.snackBar.open(`Maaf, fitur ini tidak tersedia dalam demo`, null, { duration: 3000 })
  }

  closeCase(idReport, response) {
    this.http.post("http://localhost:3000/api/admin/report/close", { uid: this.id, idReport: idReport, response: response }).toPromise();
    window.location.reload()
  }

  async ban(type, id, rid) {
    switch (type) {

      case "qna": {

        var temp = await this.http
          .post('http://localhost:3000/api/qna/metadata', { arr: [id, this.id] })
          .toPromise() as any[];
        var data = temp[0] as any;
        data._id = this.id;

        const dialogRef = this.dialog.open(BanQnA, {
          width: '80%',
          data: data
        });

        dialogRef.afterClosed().subscribe(async (result) => {
          if (!result) return;
          this.http.post("http://localhost:3000/api/admin/ban/qna", { uid: this.id, id: this.id, reason: result }).toPromise();
          this.closeCase(rid, `Banned with reason: ${result}`);
        });

      }; break;

      case "forum": {

        var temp = await this.http
          .post('http://localhost:3000/api/forum/metadata', { arr: [id, this.id] })
          .toPromise() as any[];
        var data = temp[0] as any;
        data._id = this.id;

        const dialogRef = this.dialog.open(BanForum, {
          width: '80%',
          data: data
        });

        dialogRef.afterClosed().subscribe(async (result) => {
          if (!result) return;
          this.http.post("http://localhost:3000/api/admin/ban/forum", { uid: this.id, id: this.id, reason: result }).toPromise();
          this.closeCase(rid, `Banned with reason: ${result}`);
        });

      }; break;
      case "answer": {

        var temp = await this.http
          .post('http://localhost:3000/api/answer/metadata', { idAnswer: id })
          .toPromise() as any[];
        var data = temp[0] as any;
        data._id = this.id;

        const dialogRef = this.dialog.open(BanAnswer, {
          width: '80%',
          data: data
        });

        dialogRef.afterClosed().subscribe(async (result) => {
          if (!result) return;
          this.http.post("http://localhost:3000/api/admin/ban/answer", { uid: this.id, id: id, reason: result }).toPromise();
          this.closeCase(rid, `Banned with reason: ${result}`);
        });
      }; break;
      case "pesan": {

        var temp = await this.http
          .post('http://localhost:3000/api/pesan/metadata', { idPesan: id })
          .toPromise() as any[];
        var data = temp[0] as any;
        data._id = this.id;

        const dialogRef = this.dialog.open(BanPesan, {
          width: '80%',
          data: data
        });

        dialogRef.afterClosed().subscribe(async (result) => {
          if (!result) return;
          this.http.post("http://localhost:3000/api/admin/ban/pesan", { uid: this.id, id: id, reason: result }).toPromise();
          this.closeCase(rid, `Banned with reason: ${result}`);
        });

      }; break;
    }
  }

}