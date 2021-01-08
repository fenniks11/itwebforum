import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TambahForum } from "./forum/tambah-forum/tambah-forum.component";
import { Forum } from './forum/forum.component';
import { Login } from './home/login/login.component';
import { ListForum } from './forum/list-forum/list-forum.component';
import { HeaderApp } from './home/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BukaForum } from './forum/buka-forum/buka-forum.component';
import { EditForum } from './forum/edit-forum/edit-forum.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
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
import { Err404 } from './home/404err/404err.component';
import { HighlightService } from './prism.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { TimeVerbose } from './time.component';
import { NavBar } from './misc/nav-bar/nav-bar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EditAnswer } from './qna/buka-qna/edit-answer/edit-answer.component';
import { PilihAnswer } from './qna/buka-qna/pilih-answer/pilih-answer.component';
import { TagifyComponent } from "@yaireo/tagify/dist/angular-tagify.component";
import { TagifyService } from './tagify.service';
import { FooterComponent } from './home/footer/footer.component';
import { Contact } from './home/footer/contact/contact.component';
import { About } from './home/footer/about/about.component';
import { AdviceDialog } from './home/footer/advice/advice.component';
import { EditPesan } from './forum/buka-forum/edit-answer/edit-pesan.component';
import { AdminPanel } from './admin/admin.component';
import { BanForum } from './forum/buka-forum/ban-forum/ban-forum.component';
import { BanQnA } from './qna/buka-qna/ban-qna/ban-qna.component';
import { ReportQnA } from './qna/buka-qna/report-qna/report-qna.component';
import { ReportForum } from './forum/buka-forum/report-forum/report-forum.component';
import { BanPesan } from './forum/buka-forum/ban-pesan/ban-pesan.component';
import { ReportPesan } from './forum/buka-forum/report-pesan/report-pesan.component';
import { ReportAnswer } from './qna/buka-qna/report-answer/report-answer.component';
import { BanAnswer } from './qna/buka-qna/ban-answer/ban-answer.component';
import { AdminHome } from './admin/admin-home/admin-home.component';
import { AdminReport } from './admin/admin-report/admin-report.component';
import { ReportClose } from './admin/admin-report/report-close/report-close.component';
import {MatTabsModule} from '@angular/material/tabs'; 
import { AdminTags } from './admin/admin-tags/admin-tags.component';
import { DeleteTag } from './admin/admin-tags/delete-tag/delete-tag.component';
import { EditTag } from './admin/admin-tags/edit-tag/edit-tag.component';
import { AdminAdvice } from './admin/admin-advice/admin-advice.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'; 



@NgModule({
  declarations: [
    AppComponent,
    Forum,
    TambahForum,
    ListForum,
    HeaderApp,
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
    EditQuestion,
    Err404,
    NavBar,
    EditAnswer,
    TagifyComponent,
    PilihAnswer,
    FooterComponent,
    Contact,
    About,
    AdviceDialog,
    EditPesan,
    AdminPanel,
    BanForum,
    BanQnA,
    ReportQnA,
    ReportForum,
    BanPesan,
    ReportPesan,
    ReportAnswer,
    BanAnswer,
    AdminHome,
    AdminReport,
    ReportClose,
    AdminTags,
    DeleteTag,
    EditTag,
    AdminAdvice
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
    MatDialogModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatTabsModule,
    FormsModule,
    HttpClientModule,
    MatGridListModule,
    MatIconModule,
    MatStepperModule,
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    ClipboardModule,
    MatExpansionModule,
    NgbModule,
    MonacoEditorModule.forRoot()

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  entryComponents: [
    EditAnswer,
    PilihAnswer,
    Contact,
    About,
    AdviceDialog,
    EditPesan,
    BanForum,
    BanQnA,
    ReportQnA,
    ReportForum,
    BanPesan,
    ReportPesan,
    ReportAnswer,
    BanAnswer,
    ReportClose,
    DeleteTag,
    EditTag
  ],
  providers: [{ provide: Window, useValue: window }, HighlightService, TimeVerbose, TagifyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
