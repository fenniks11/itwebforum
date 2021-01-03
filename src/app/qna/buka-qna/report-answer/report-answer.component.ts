import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimeVerbose } from 'src/app/time.component';

@Component({
    selector: 'report-answer',
    templateUrl: './report-answer.html',
    styleUrls: ["report-answer.css"]
})
export class ReportAnswer {
    selected = {} as any;
    _id: any;
    reason = {title: "", describe: ""}
    logged_in = !sessionStorage.getItem("_id") ? false : true;


    constructor(
        public dialogRef: MatDialogRef<ReportAnswer>,
        private timeVerbose: TimeVerbose,
        @Inject(MAT_DIALOG_DATA) public data: any) { }


    async ngOnInit() {
        console.log(this.data);

        this.selected = this.data;
        this._id = this.data._id;
    }

    verboseTime(time) {
        return this.timeVerbose.parseTime(time).verbose[5]
    }

    batal(): void {
        this.dialogRef.close();
    }


}

