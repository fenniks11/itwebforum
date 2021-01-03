import { Component,ViewEncapsulation, AfterViewChecked } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HighlightService } from 'src/app/prism.component';

@Component({
    selector: 'admin',
    templateUrl: './admin.html',
    styleUrls: ["admin.css", "../../../node_modules/prismjs/themes/prism-okaidia.css", "../../../node_modules/prismjs/plugins/toolbar/prism-toolbar.css"],
    encapsulation: ViewEncapsulation.None
})
export class AdminPanel implements AfterViewChecked {

    root = { route: "/admin", name: "Admin Panel" }
    id = sessionStorage.getItem("_id").toString();
    check = 0;
    unauthorized = false;
    details = {} as any
    activePage = "home"

    constructor(private router: Router, private http: HttpClient, private highlightService: HighlightService) { };

    ngAfterViewChecked() {
        this.highlightService.start((toCompiler) => {
          toCompiler.newTab ?
            window.open(`${window.location.protocol}//${window.location.host}/compilerun;lang=${toCompiler.lang};code=${toCompiler.code}`) :
            this.router.navigate(["compilerun", { lang: toCompiler.lang, code: toCompiler.code }])
        });
    
        console.clear()
      }

    async ngOnInit() {
        if (!this.id) return this.router.navigate(['login', { oncomplete: this.router.url }]);

        this.details = (await this.http.post('http://localhost:3000/api/user/get', { id: this.id }).toPromise());
        this.check = 1;
        if(parseInt(this.details.level) < 90) this.unauthorized = true;
        
    }

    home(){

    }

}

