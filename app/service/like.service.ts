import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Likeservice {
 private url = 'http://localhost:3001/'

 constructor(private http: HttpClient) {}

    addlike(formdata:any):Observable<any>{
        return this.http.post<any>(`${this.url}like/addlike`, formdata)
    }
    getalllikeme(id_me:any,arridpost:any):Observable<any>{
      const ok = {id_user:id_me,id_post:arridpost}
      return this.http.post<any>(`${this.url}like/getalllikeme`,ok)
    }
    deletelike(formdata:any):Observable<any>{
      return this.http.post<any>(`${this.url}like/deletelike`,formdata)
    }

}
