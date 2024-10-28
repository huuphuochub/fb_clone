import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Folowerservice {
    // private url = 'http://192.168.2.39:3001/'
    private url = 'http://localhost:3001/'

    // private url = 'https://huuphuoc.test.huuphuoc.id.vn/'

 constructor(private http: HttpClient) {}

    addfolower(formdata:any):Observable<any>{
        return this.http.post<any>(`${this.url}folower/addfolower/`, formdata)
    }
    getfolowerbyuser(id_user:any):Observable<any>{
        return this.http.get<any>(`${this.url}folower/getfolowerbyuser/${id_user}`)
    }
    updatefolower(id_folower:any):Observable<any>{
    return this.http.put<any>(`${this.url}folower/updatefolower/`, id_folower)
}}
