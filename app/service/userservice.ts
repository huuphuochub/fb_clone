import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, share } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Sharedataservice } from './sharedata.service';

@Injectable({
  providedIn: 'root'
})
export class Userservice {
  private url = 'http://192.168.2.39:3001/'

//  private url = 'https://huuphuoc.test.huuphuoc.id.vn/'

 constructor(private http: HttpClient) {}
    
 getUserIP(): Observable<any> {
  return this.http.get('https://api.ipify.org?format=json');
}

  checkemail(emails:any):Observable<any>{
    const emailss= {email:emails}
    return this.http.post<any>(`${this.url}user/checkemail/`, emailss);
  }
  guima(emails:any):Observable<any>{
    const email = {email:emails}
    return this.http.post<any>(`${this.url}user/xacthuc/`, email);
  }
  checkma(ma:any):Observable<any>{
    const maotp ={otp:ma}
    return this.http.post<any>(`${this.url}user/checkma/`, maotp);
  }
  dangky(formdata:any):Observable<any>{
    
    return this.http.post<any>(`${this.url}user/dangky/`, formdata);
  }
  setprofile(formdata:any):Observable<any>{
    
    return this.http.post<any>(`${this.url}user/setprofile/`, formdata);
  }
  getuser(id:any):Observable<any>{
  return this.http.get<any>(`${this.url}user/${id}`)
  }
  login(formdata:any):Observable<any>{
    console.log('ok');
    
    return this.http.post<any>(`${this.url}user/login/`, formdata);
  }
  getuserbyarrid(formdata:any[]):Observable<any>{
    return this.http.post<any>(`${this.url}user/getalluserbyarrid/`, formdata);
  }

}
