import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimeVerbose } from 'src/app/time.component';

@Component({
    selector: 'delete-tag',
    templateUrl: './delete-tag.html',
    styleUrls: ["delete-tag.css"]
})
export class DeleteTag {
    selected = {} as any;
    _id: any;
    first_conf = false;
    verify = ""
    logged_in = !sessionStorage.getItem("_id") ? false : true;


    constructor(
        public dialogRef: MatDialogRef<DeleteTag>,
        private timeVerbose: TimeVerbose,
        @Inject(MAT_DIALOG_DATA) public data: any) { }


    async ngOnInit() {
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

