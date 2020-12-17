import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TambahForum } from './forum/tambah-forum/tambah-forum.component';
import { BukaForum } from './forum/buka-forum/buka-forum.component';
import { EditForum } from './forum/edit-forum/edit-forum.component';
import { Forum } from './forum/forum.component';
import { Login } from './home/login/login.component';
import { Register } from './home/register/register.component';
import { Profile } from './home/profile/profile.component';
import { HomeComponent } from './home/home.component';
import { CompileRun } from './forum/compilerun/compilerun.component';
import { Search } from './home/search/search.component';



const routes: Routes = [
  { path: 'forum/tambah', component: TambahForum },
  { path: 'forum/buka', component: BukaForum },
  { path: 'forum/edit', component: EditForum },
  { path: 'forum', component: Forum },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile },
  { path: 'home', component: HomeComponent },
  { path: 'compilerun', component: CompileRun },
  { path: 'search', component: Search },
  { path: '', component: Forum } //Main page
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
