import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Messengerservice {
  private url = 'http://192.168.2.39:3001/'

  // private url = 'https://huuphuoc.test.huuphuoc.id.vn/'

 constructor(private http: HttpClient) {}

  addromchat(data:any):Observable<any>{
       
    return this.http.post<any>(`${this.url}messenger/addroom/`, data);
  }
  getallroombyuser(id:any):Observable<any>{
    return this.http.get<any>(`${this.url}messenger/getallroombyuser/${id}`)
  }  

  fetchchatbyroom(id:any):Observable<any>{
    return this.http.get<any>(`${this.url}messenger/getchatbyroom/${id}`)
  }
  sendchat(formdata:any):Observable<any>{
       
    return this.http.post<any>(`${this.url}messenger/sendchat/`, formdata);
  }
  getgroupchatbyuser(id:any):Observable<any>{
    return this.http.get<any>(`${this.url}messenger/getallgroupchatbyuser/${id}`)

  }
  addgroupchat(formdata:any):Observable<any>{
    return this.http.post<any>(`${this.url}messenger/addgroupchat/`,formdata)
  }

}
