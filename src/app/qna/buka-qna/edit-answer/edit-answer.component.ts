import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'edit-answer',
    templateUrl: './edit-answer.html',
})
export class EditAnswer {
    jawaban_ori: string;
    jawaban = "";
    logged_in = !sessionStorage.getItem("_id") ? false : true;


    constructor(
        public dialogRef: MatDialogRef<EditAnswer>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    public TinyMce = {
        height: 500,
        menubar: false,
        plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code codesample fullscreen',
            'insertdatetime media table paste code help wordcount'
        ],
        toolbar:
            'undo redo | formatselect | codesample bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | link image media | help',

        selector: 'textarea',
        codesample_languages: [
            { text: 'HTML/XML', value: 'markup' },
            { text: 'NodeJS / JavaScript', value: 'javascript' },
            { text: 'CSS', value: 'css' },
            { text: 'PHP', value: 'php' },
            { text: 'Python', value: 'python' },
            { text: 'Java', value: 'java' },
            { text: 'C', value: 'c' },
            { text: 'C++', value: 'cpp' }
        ],
        images_upload_handler: function (blobInfo, success, failure) {
            var xhr, formData;

            xhr = new XMLHttpRequest();
            xhr.withCredentials = false;
            xhr.open('POST', 'http://localhost:3000/api/forum/img_pesan');

            xhr.onload = function () {
                if (xhr.responseText.startsWith("Fail")) return failure(xhr.responseText);
                else success(xhr.responseText);
            };

            formData = new FormData();
            formData.append('file', blobInfo.blob(), blobInfo.filename());

            xhr.send(formData);
        }
    }

    async ngOnInit() {
        console.log(this.data.jawaban);
        
        this.jawaban = this.jawaban_ori = this.data.jawaban;
    }

    batal(): void {
        this.dialogRef.close();
    }


}

