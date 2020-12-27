import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  panelOpenState = false;
  totalForum = 0
  totalPesan = 0
  totalPertanyaan = 0
  pertanyaanTerjawab = 0
  totalTag = 0
  totalPenggunaTerdaftar = 0
  logged_in = !sessionStorage.getItem("_id") ? false : true;



  constructor(private http: HttpClient) { }

  async ngOnInit() {
    var res = await this.http.get("http://localhost:3000/api/statistic").toPromise() as any;
    console.log(res);

    this.totalForum = res.forum
    this.totalPesan = res.pesan
    this.totalPertanyaan = res.pertanyaan
    this.pertanyaanTerjawab = res.pertanyaan_terjawab
    this.totalTag = res.tags
    this.totalPenggunaTerdaftar = res.user
    

  }

}
