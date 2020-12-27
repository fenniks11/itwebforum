import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimeVerbose } from 'src/app/time.component';

@Component({
    selector: 'contact',
    templateUrl: './contact.html',
    styleUrls: ["contact.css"]
})
export class Contact {


    constructor(
        public dialogRef: MatDialogRef<Contact>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }


    async ngOnInit() {

    }

    batal(): void {
        this.dialogRef.close();
    }

}

