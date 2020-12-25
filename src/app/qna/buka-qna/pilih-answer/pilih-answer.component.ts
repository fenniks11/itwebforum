import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimeVerbose } from 'src/app/time.component';

@Component({
    selector: 'pilih-answer',
    templateUrl: './pilih-answer.html',
    styleUrls: ["pilih-answer.css"]
})
export class PilihAnswer {
    selected = {} as any;
    _id: any;
    logged_in = !sessionStorage.getItem("_id") ? false : true;


    constructor(
        public dialogRef: MatDialogRef<PilihAnswer>,
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

