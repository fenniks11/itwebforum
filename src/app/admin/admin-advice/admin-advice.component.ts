import { Component, Input, NgModule } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
    selector: 'admin-advice',
    templateUrl: './admin-advice.html',
    styleUrls: ["admin-advice.css"]
})
export class AdminAdvice {
    constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private snackBar: MatSnackBar) { };
    id = sessionStorage.getItem("_id").toString();
    check = 0;
    unauthorized = false;
    details = {} as any

    advList = [] as any;


    async ngOnInit() {
        if (!this.id) return this.router.navigate(['login', { oncomplete: this.router.url }]);

        this.details = (await this.http.post('http://localhost:3000/api/user/get', { id: this.id }).toPromise());
        this.check = 1;
        if (parseInt(this.details.level) < 90) this.unauthorized = true;

        this.advList = (await this.http.post('http://localhost:3000/api/admin/advice/list', { uid: this.id }).toPromise());
    }

    async deleteFrom(from, fromName) {
        this.snackBar.open(`Hapus semua saran dari ${fromName} (Semua yang Baru)?`, "Hapus", { duration: 5000 })
            .onAction().subscribe(async () => {
                (await this.http.post('http://localhost:3000/api/admin/advice/delete_all', { uid: this.id, idd: from }).toPromise());
                this.ngOnInit()
                this.snackBar.open(`Semua saran baru dari ${fromName} terhapus dari database`, "Ok", { duration: 5000 })
            });
    }

    async markRead(id) {
        (await this.http.post('http://localhost:3000/api/admin/advice/read', { uid: this.id, idAdv: id }).toPromise());
        this.ngOnInit()
    }

    async consider(id) {
        (await this.http.post('http://localhost:3000/api/admin/advice/consider', { uid: this.id, idAdv: id }).toPromise());
        this.ngOnInit()
    }

    async unconsider(id) {

        this.snackBar.open(`Hapus saran ini dari pertimbangan`, "Hapus", { duration: 5000 })
            .onAction().subscribe(async () => {
                (await this.http.post('http://localhost:3000/api/admin/advice/unconsider', { uid: this.id, idAdv: id }).toPromise());
                this.ngOnInit()
                this.snackBar.open(`Saran ini sudah tidak dipertimbangkan lagi`, "Ok", { duration: 5000 })
            });
    }

    
    async accept(id) {

        this.snackBar.open(`Terima saran ini?`, "Terima", { duration: 5000 })
            .onAction().subscribe(async () => {
                (await this.http.post('http://localhost:3000/api/admin/advice/accept', { uid: this.id, idAdv: id }).toPromise());
                this.ngOnInit()
                this.snackBar.open(`Saran ini ditandai sebagai diterima`, "Ok", { duration: 5000 })
            });
    }

}