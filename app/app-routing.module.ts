import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import {HomeComponent} from './component/home/home.component'
import { ProfileuserComponent } from './component/profileuser/profileuser.component';
import { LoginComponent } from './component/login/login.component';
import { DangkiComponent } from './component/dangki/dangki.component';
import { AuthenticateComponent } from './component/authenticate/authenticate.component';
import { SettingprofileComponent } from './component/settingprofile/settingprofile.component';
import { SearchComponent } from './component/search/search.component';

const routes: Routes = [

  {path: '', component:HomeComponent},
  {path:'profileuser/:id', component:ProfileuserComponent},
  {path:'login', component:LoginComponent},
  {path:'regsiter', component:DangkiComponent},
  {path:'authenticate', component:AuthenticateComponent},
  {path:'setprofile', component:SettingprofileComponent},
  {path:'search', component:SearchComponent},



  { path: '**', redirectTo: '', pathMatch: 'full' },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
