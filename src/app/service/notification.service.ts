import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class Notificationservice {
  constructor(private http:HttpClient){}
  // private url = 'http://192.168.2.39:3001/'
  private url = 'http://localhost:3001/'

  // private url = 'https://huuphuoc.test.huuphuoc.id.vn/'

  addnotification(formdata:any):Observable<any>{
    return this.http.post<any>(`${this.url}notification/add/`,formdata)
  }
  getnotibyuser(id_user:any):Observable<any>{
    return this.http.get<any>(`${this.url}notification/getnotibyuser/${id_user}`)
  }
  updatenoti(ids:any):Observable<any>{
    const idss = {id:ids}
    return this.http.post<any>(`${this.url}notification/update/`,idss)
  }
  
}
