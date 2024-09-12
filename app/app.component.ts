import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ConnectivityService } from './service/checkconnect.service';
import { catchError, finalize } from 'rxjs';


@Component({
  selector: 'app-root',
  
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  isConnected:boolean = false
  isloading:boolean=false
  isconnected:boolean = false;
  constructor(private router: Router,private connectivityService:ConnectivityService) {}

  ngOnInit(): void {
      this.checkconnect()
  }
  private checkconnect(): void {
  this.isloading = true
    this.connectivityService.checkConnection()
    .pipe(
      catchError((error:any) =>{
        console.error('error');
        return '';
      }),
      finalize(() =>{
        this.isloading = false;
      })
    )
    
    .subscribe(isConnected => {
      isConnected;
      console.log(isConnected)
      if (isConnected) {
        this.isconnected = true
      } else {
        this.isconnected = false

      }
    });
  }
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
