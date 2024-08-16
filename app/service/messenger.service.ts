import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Messengerservice {
 private url = 'http://localhost:3001/'

 constructor(private http: HttpClient) {}

  addromchat(data:any):Observable<any>{
       
    return this.http.post<any>(`${this.url}messenger/addroom`, data);
  }
  getallroombyuser(id:any):Observable<any>{
    return this.http.get<any>(`${this.url}messenger/getallroombyuser/${id}`)
  }  

  fetchchatbyroom(id:any):Observable<any>{
    return this.http.get<any>(`${this.url}messenger/getchatbyroom/${id}`)
  }
  sendchat(formdata:any):Observable<any>{
       
    return this.http.post<any>(`${this.url}messenger/sendchat`, formdata);
  }

}
