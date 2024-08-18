import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Postservice {
 private url = 'http://localhost:3001/'

 constructor(private http: HttpClient) {}

    addpost(formdata:any):Observable <any>{
        return this.http.post<any>(`${this.url}post/addpost`, formdata)
    }
    getallpostformfriend(id_user:any):Observable<any>{
      return this.http.get<any>(`${this.url}post/getallpostbyfriend/${id_user}`)
    }
    getpostformidpost(id_post:any):Observable<any>{
      return this.http.get<any>(`${this.url}post/getpostformidpost/${id_post}`)
    }
    getpostbyarriduser(id_user:any[]):Observable<any>{
      return this.http.post<any>(`${this.url}post/getpostbyarriduser/` ,id_user)
    }
    getpostbyfriend(id_friend:any[]):Observable<any>{
      return this.http.post<any>(`${this.url}post/getpostbyfriend`, id_friend)
    }
    getpostbyfolowinf(id_folowing:any[]):Observable<any>{
      return this.http.post<any>(`${this.url}post/getpostbyfolowing`, id_folowing)
    }
    getpostbyme(id:any):Observable<any>{
      return this.http.get<any>(`${this.url}post/getpostbyme/${id}`)
    }
}
