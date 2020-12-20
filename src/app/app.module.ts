import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TambahForum } from "./forum/tambah-forum/tambah-forum.component";
import { Forum } from './forum/forum.component';
import { Login } from './home/login/login.component';
import { ListForum } from './forum/list-forum/list-forum.component';
import { HeaderForum } from './home/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { MatCardModule, MatCard } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
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
import { Register } from './home/register/register.component';
import { Profile } from './home/profile/profile.component';
import { CompileRun } from './compilerun/compilerun.component';
import { SafePipe } from './safe.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { Search } from './home/search/search.component';
import { QuestionAndAnswer } from './qna/qna.component';
import { ListQuestion } from './qna/list-question/list-question.component';
import { TambahQuestion } from './qna/tambah-q/tambah-q.component';
import { BukaQnA } from './qna/buka-qna/buka-qna.component';
import { EditQuestion } from './qna/edit-question/edit-question.component';



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
    HomeComponent,
    CompileRun,
    SafePipe,
    Search,
    QuestionAndAnswer,
    ListQuestion,
    TambahQuestion,
    BukaQnA,
    EditQuestion
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
    ClipboardModule,
    MatExpansionModule,
    NgbModule

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [ { provide: Window, useValue: window }],
  bootstrap: [AppComponent]
})
export class AppModule { }
