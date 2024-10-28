import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ConnectivityService } from './service/checkconnect.service';
import { catchError, finalize } from 'rxjs';
import { Userservice } from './service/userservice';


@Component({
  selector: 'app-root',
  
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  isConnected:boolean = false
  isloading:boolean=false
  isconnected:boolean = false;
  loiserver:boolean = false;
  id_user:any;
  constructor(private router: Router,private connectivityService:ConnectivityService, private userservice :Userservice) {}

  ngOnInit(): void {
    this.checkconnect()

    this.id_user = localStorage.getItem('id_user');
    if(!this.id_user){
      this.router.navigate(['/login']);
    }else{
      this.checkusser(this.id_user);
    }
  }
  private checkusser(id:any):void{
    this.isloading = true;
    this.userservice.getuser(id).pipe(
      catchError(error => {
        console.log(error);
        
        this.loiserver = true
        return (error); 
      }),
      finalize(() =>{
        this.isloading = false;
      })
    ).subscribe(data => {
     
    });
  }
  private checkconnect(): void {
  this.isloading = true
    this.connectivityService.checkConnection()
    .pipe(
      catchError((error:any) =>{


        return '';
      }),
      finalize(() =>{
        this.isloading = false;
      })
    )
    
    .subscribe(isConnected => {
      isConnected;
      if (isConnected) {
        this.isconnected = true
        // console.log('đã kết nối');
        
      } else {
        this.isconnected = false;
        // console.log('chưa kết nối');
        

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
