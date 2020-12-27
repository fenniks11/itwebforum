import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimeVerbose } from 'src/app/time.component';

@Component({
    selector: 'advice',
    templateUrl: './advice.html',
    styleUrls: ["advice.css"]
})
export class AdviceDialog {


    constructor(
        public dialogRef: MatDialogRef<AdviceDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }


    async ngOnInit() {

    }

    batal(): void {
        this.dialogRef.close();
    }

}

