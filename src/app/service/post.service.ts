import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Postservice {
  // private url = 'http://192.168.2.39:3001/'
  private url = 'http://localhost:3001/'

  // private url = 'https://huuphuoc.test.huuphuoc.id.vn/'

 constructor(private http: HttpClient) {}

    addpost(formdata:any):Observable <any>{
        return this.http.post<any>(`${this.url}post/addpost/`, formdata)
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
      return this.http.post<any>(`${this.url}post/getpostbyfriend/`, id_friend)
    }
    getallpostbyuser(id:any):Observable<any>{
      return this.http.get<any>(`${this.url}post/getallpostbyuser/${id}`)
    }
    getpagepostbyfriend(id_friend:any[],pagepost:any):Observable<any>{
      const data = {
        id: id_friend, // Giả sử id_friend là mảng id
        page: pagepost // Số trang
      };
      return this.http.post<any>(`${this.url}post/getpagepostbyfriend/`, data)
    }
    getpostbyfolowinf(id_folowing:any[]):Observable<any>{
      return this.http.post<any>(`${this.url}post/getpostbyfolowing/`, id_folowing)
    }
    getpostbyme(id:any):Observable<any[]>{
      return this.http.get<any[]>(`${this.url}post/getpostbyme/${id}`)
    }
    getpostbyid(id:any):Observable<any>{
      return this.http.get<any>(`${this.url}post/getpostbyid/${id}`)
    }
    
}
