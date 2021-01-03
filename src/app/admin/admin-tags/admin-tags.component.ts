import { Component, Input, NgModule } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteTag } from './delete-tag/delete-tag.component';
import { MatDialog } from '@angular/material/dialog';
import { EditTag } from './edit-tag/edit-tag.component';


@Component({
  selector: 'admin-tags',
  templateUrl: './admin-tags.html',
  styleUrls: ["admin-tags.css"]
})
export class AdminTags {
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private snackBar: MatSnackBar, public dialog: MatDialog) { };



  id = sessionStorage.getItem("_id").toString();
  check = 0;
  unauthorized = false;
  details = {} as any

  tagList = [] as any;

  newTag = {
    name: "",
    description: "",
    uid: this.id
  }


  async ngOnInit() {
    if (!this.id) return this.router.navigate(['login', { oncomplete: this.router.url }]);

    this.details = (await this.http.post('http://localhost:3000/api/user/get', { id: this.id }).toPromise());
    this.check = 1;
    if (parseInt(this.details.level) < 90) this.unauthorized = true;

    this.tagList = (await this.http.get('http://localhost:3000/api/tags/list').toPromise()) as any[];
  }

  async addTag() {
    (await this.http.post('http://localhost:3000/api/admin/tag/add', this.newTag).toPromise());
    this.snackBar.open(`"${this.newTag.name}" berhasil ditambahkan ke database tags!`, "Ok", { duration: 5000 })
    this.newTag.name = ""
    this.newTag.description = ""
  }

  async deleteTag(idTag, value) {
    const dialogRef = this.dialog.open(DeleteTag, {
      width: '80%',
      data: { value: value }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) return;

      // ke hapus tag
      (await this.http.post('http://localhost:3000/api/admin/tag/delete', { uid: this.id, idTag: idTag}).toPromise());
      this.snackBar.open(`"${value}" telah terhapus dari semua database`, "Ok", { duration: 5000 })
      this.ngOnInit()
    });
  }

  async editTag(idTag, value, description) {
    const dialogRef = this.dialog.open(EditTag, {
      width: '80%',
      data: { value: value, description: description }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) return;

      // ke edit tag
      (await this.http.post('http://localhost:3000/api/admin/tag/edit', { uid: this.id, idTag: idTag, name: result.value, description: result.description }).toPromise());
      this.snackBar.open(`"${result.description}" berhasil diedit!`, "Ok", { duration: 5000 })
      this.ngOnInit()
    });
  }

}