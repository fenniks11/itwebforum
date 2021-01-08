import { Component, NgModule, Input } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Contact } from './contact/contact.component';
import { About } from './about/about.component';
import { AdviceDialog } from "./advice/advice.component";

@Component({
  selector: 'footer-app',
  templateUrl: './footer.html',
  styleUrls: ['footer.css']
})
export class FooterComponent {
  @Input() public titleHeader: string;
  constructor(public dialog: MatDialog, private http: HttpClient, private snackBar: MatSnackBar) { };

  async ngOnInit() {

  }

  contactDialog() {
    const dialogRef = this.dialog.open(Contact, {
      width: '60%',
      data: {}
    });
  }

  aboutDialog() {
    const dialogRef = this.dialog.open(About, {
      width: '60%',
      data: {}
    });
  }

  adviceDialog() {
    const dialogRef = this.dialog.open(AdviceDialog, {
      width: '60%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) return;

      // ke edit tag
      (await this.http.post('http://localhost:3000/api/advice/in', result).toPromise());
      this.snackBar.open(`Terimakasih atas sarannya!`, "Ok", { duration: 5000 })
    });
  }

}

