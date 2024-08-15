import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Friendservice {
 private url = 'http://localhost:3001/'

 constructor(private http: HttpClient) {}

 addfriend(formdata:any):Observable<any>{
    return this.http.post<any>(`${this.url}friend/addfriend`, formdata);
  }
  getallfriend(id:any):Observable<any>{
    // console.log(id);
    return this.http.get<any>(`${this.url}friend/allfriend/${id}`)
  }
  timbancuaban(id:any[]):Observable<any>{
    return this.http.post<any>(`${this.url}friend/laytatcabancuauser`,id)
  }
  timbancuaminh(id:any):Observable<any>{
    // console.log(typeof id);
    return this.http.get<any>(`${this.url}friend/getallfriend/${id}`)
  }
  
  laythongtinfriendbyuser(id:any):Observable<any>{
    // console.log(typeof id);
    return this.http.get<any>(`${this.url}friend/getallfriendbyuerr/${id}`)
  }
  acpfriend(id:any):Observable<any>{
    // console.log(typeof id);
    return this.http.put<any>(`${this.url}friend/acpfriend`,id)
  }
  huyloimoi(id:any):Observable<any>{
    // console.log(typeof id);
    return this.http.delete<any>(`${this.url}friend/cancelloimoi/${id}`)
  }

  
}
