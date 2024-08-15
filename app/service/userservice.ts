import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Userservice {
 private url = 'http://localhost:3001/'

 constructor(private http: HttpClient) {}

  checkemail(emails:any):Observable<any>{
    const emailss= {email:emails}
    return this.http.post<any>(`${this.url}user/checkemail`, emailss);
  }
  guima(emails:any):Observable<any>{
    const email = {email:emails}
    return this.http.post<any>(`${this.url}user/xacthuc`, email);
  }
  checkma(ma:any):Observable<any>{
    const maotp ={otp:ma}
    return this.http.post<any>(`${this.url}user/checkma`, maotp);
  }
  dangky(formdata:any):Observable<any>{
    
    return this.http.post<any>(`${this.url}user/dangky`, formdata);
  }
  setprofile(formdata:any):Observable<any>{
    
    return this.http.post<any>(`${this.url}user/setprofile`, formdata);
  }
  getuser(id:any):Observable<any>{
  return this.http.get<any>(`${this.url}user/${id}`)
  }
  login(formdata:any):Observable<any>{
    
    return this.http.post<any>(`${this.url}user/login`, formdata);
  }

}
