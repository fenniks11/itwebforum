import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TambahForum } from "./forum/tambah-forum/tambah-forum.component";
import { Forum } from './forum/forum.component';
import { Login } from './forum/login/login.component';
import { ListForum } from './forum/list-forum/list-forum.component';
import { HeaderForum } from './forum/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from '@angular/cdk/clipboard';


import { MatCardModule, MatCard } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatToolbarModule, MatToolbar } from "@angular/material/toolbar";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BukaForum } from './forum/buka-forum/buka-forum.component';
import { EditForum } from './forum/edit-forum/edit-forum.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { EditorModule } from '@tinymce/tinymce-angular';
import { Register } from './forum/register/register.component';
import { Profile } from './forum/profile/profile.component';
import { Globals } from './globals';
import { CompileRun } from './forum/compilerun/compilerun.component';
import { SafePipe } from './safe.pipe';



@NgModule({
  declarations: [
    AppComponent,
    Forum,
    TambahForum,
    ListForum,
    HeaderForum,
    BukaForum,
    EditForum,
    Login,
    Register,
    Profile,
    CompileRun,
    SafePipe
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    FormsModule,
    HttpClientModule,
    MatGridListModule,
    MatIconModule,
    MatStepperModule,
    MatTableModule,
    MatPaginatorModule,
    CKEditorModule,
    MatSnackBarModule,
    ClipboardModule

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [Globals],
  bootstrap: [AppComponent]
})
export class AppModule { }
