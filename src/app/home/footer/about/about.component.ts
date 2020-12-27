import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimeVerbose } from 'src/app/time.component';

@Component({
    selector: 'about',
    templateUrl: './about.html',
    styleUrls: ["about.css"]
})
export class About {


    constructor(
        public dialogRef: MatDialogRef<About>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }


    async ngOnInit() {

    }

    batal(): void {
        this.dialogRef.close();
    }

}

