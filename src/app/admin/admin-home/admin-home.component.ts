import { Component, Input, NgModule } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'admin-home',
  templateUrl: './admin-home.html',
    styleUrls: ["admin-home.css"]
})
export class AdminHome {
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) { };
  id = sessionStorage.getItem("_id").toString();
  check = 0;
  unauthorized = false;
  details = {} as any
  statistic: any;


  async ngOnInit() {
    if (!this.id) return this.router.navigate(['login', { oncomplete: this.router.url }]);

    this.details = (await this.http.post('http://localhost:3000/api/user/get', { id: this.id }).toPromise());
    this.check = 1;
    if(parseInt(this.details.level) < 90) this.unauthorized = true;

    this.statistic = (await this.http.post('http://localhost:3000/api/admin/statistic', { uid: this.id }).toPromise());

    
  }

}