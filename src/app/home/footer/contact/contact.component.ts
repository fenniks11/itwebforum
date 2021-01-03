import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'contact',
    templateUrl: './contact.html',
    styleUrls: ["contact.css"]
})
export class Contact {

    phone = "0811000XX123"
    email = "forum_ti@usu.ac.id"
    whatsapp = "0811000XX123"

    constructor(
        public dialogRef: MatDialogRef<Contact>,
        private clipboard: Clipboard,
        private snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: any) { }


    async ngOnInit() {

    }

    batal(): void {
        this.dialogRef.close();
    }

    copy(type) {
        switch (type) {
            case "email": {
                this.snackBar.open(`Email tersalin ke clipboard kamu!`, null, { duration: 3000 })
                this.clipboard.copy(this.email)
            }; break;

            case "phone": {
                this.snackBar.open(`Nomor telefon tersalin ke clipboard kamu!`, null, { duration: 3000 })
                this.clipboard.copy(this.phone)
            }; break;

            case "whatsapp": {
                this.snackBar.open(`Nomor WhatsApp tersalin ke clipboard kamu!`, null, { duration: 3000 })
                this.clipboard.copy(this.whatsapp)
            }; break;
        }

    }

}

