import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { LoginComponent } from './component/login/login.component';
import { DangkiComponent } from './component/dangki/dangki.component';
import { ProfileuserComponent } from './component/profileuser/profileuser.component';
import { AuthenticateComponent } from './component/authenticate/authenticate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SettingprofileComponent } from './component/settingprofile/settingprofile.component';
import { SearchComponent } from './component/search/search.component';
import { ProfilemeComponent } from './component/profileme/profileme.component';
import { PostComponent } from './component/post/post.component';
import { StoriesComponent } from './component/stories/stories.component';
import { TestvideoComponent } from './component/testvideo/testvideo.component';
import { FriendComponent } from './component/friend/friend.component'; // Import HttpClientModule
import { InfiniteScrollModule } from 'ngx-infinite-scroll';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    DangkiComponent,
    ProfileuserComponent,
    AuthenticateComponent,
    SettingprofileComponent,
    SearchComponent,
    ProfilemeComponent,
    PostComponent,
    StoriesComponent,
    TestvideoComponent,
    FriendComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
