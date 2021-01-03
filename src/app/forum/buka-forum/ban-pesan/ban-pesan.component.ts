import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimeVerbose } from 'src/app/time.component';

@Component({
    selector: 'ban-pesan',
    templateUrl: './ban-pesan.html',
    styleUrls: ["ban-pesan.css"]
})
export class BanPesan {
    selected = {} as any;
    _id: any;
    reason = ""
    logged_in = !sessionStorage.getItem("_id") ? false : true;


    constructor(
        public dialogRef: MatDialogRef<BanPesan>,
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

