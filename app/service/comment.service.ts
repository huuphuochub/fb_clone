import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Commentservice {
 private url = 'http://192.168.2.39:3001/'

 constructor(private http: HttpClient) {}

   
    getcommentbypost(id_post:any):Observable<any>{
        return this.http.get<any>(`${this.url}comment/getcommentbypost/${id_post}`)
    }
    addcomment(formdata:any):Observable<any>{
      return this.http.post<any>(`${this.url}comment/addcmt`,formdata)
    }
}
