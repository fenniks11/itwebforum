import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimeVerbose } from 'src/app/time.component';

@Component({
    selector: 'advice',
    templateUrl: './advice.html',
    styleUrls: ["advice.css"]
})
export class AdviceDialog {

    logged_in = !sessionStorage.getItem("_id") ? false : true;
    about = ""
    describe = ""

    constructor(
        public dialogRef: MatDialogRef<AdviceDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }


    async ngOnInit() {

    }

    kirim(): void{
        this.dialogRef.close({about: this.about, describe: this.describe, uid: sessionStorage.getItem("_id")})
    }

    batal(): void {
        this.dialogRef.close();
    }

}

