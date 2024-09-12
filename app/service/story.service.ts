import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Storyservice {
  private url = 'http://192.168.2.39:3001/'

 constructor(private http: HttpClient) {}

   
  addstory(formdata:any):Observable<any>{
    return this.http.post<any>(`${this.url}story/upstory`, formdata)
  }
  getstoryathome(id_user:any):Observable<any>{
    return this.http.get<any>(`${this.url}story/getstoryathome${id_user}`)
  }
  getstorybyme(id_user:any):Observable<any>{
    return this.http.get<any>(`${this.url}story/getstorybyme/${id_user}`)
  }
  getstorybyuser(id_user:any):Observable<any>{
    return this.http.get<any>(`${this.url}story/getstoryathome${id_user}`)
  }
  getstorybyariduser(id:any):Observable<any>{
    return this.http.post<any>(`${this.url}story/getstorybyariduser`, id)
  }
}
