import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-root',
  
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private router: Router) {}

  isAdminRoute(): boolean {
    // Lấy đường dẫn hiện tại từ router
    const currentUrl = this.router.url;

    // Kiểm tra xem đường dẫn có chứa 'admin' không
    return currentUrl.includes('/admin');
  }

  formlogin():boolean{
    const currentUrl = this.router.url;

    // Kiểm tra xem đường dẫn có chứa 'admin' không
    return currentUrl.includes('/login');
  }
  
  formsign():boolean{
    const currentUrl = this.router.url;

    // Kiểm tra xem đường dẫn có chứa 'admin' không
    return currentUrl.includes('/regsiter');
  }

  passwordparmy():boolean{
    const currentUrl = this.router.url;

    // Kiểm tra xem đường dẫn có chứa 'admin' không
    return currentUrl.includes('/passwordarmy');
  }
  cfpassword():boolean{
    const currentUrl = this.router.url;

    // Kiểm tra xem đường dẫn có chứa 'admin' không
    return currentUrl.includes('/cfpassword');
  }
  signuser():boolean{
    const currentUrl = this.router.url;

    // Kiểm tra xem đường dẫn có chứa 'admin' không
    return currentUrl.includes('/signuser');
  }
  authenticate():boolean{
    const currentUrl = this.router.url;
    return currentUrl.includes('/authenticate')
  }
  setprofile():boolean{
    const currentUrl = this.router.url;
    return currentUrl.includes('/setprofile');
  }
  // search():boolean{
  //   const currentUrl = this.router.url;
  //   return currentUrl.includes('/search');
  // }
}
