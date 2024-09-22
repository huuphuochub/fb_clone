import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Friendservice {
  private url = 'http://192.168.2.39:3001/'

  // private url = 'https://huuphuoc.test.huuphuoc.id.vn/'

 constructor(private http: HttpClient) {}

 addfriend(formdata:any):Observable<any>{
    return this.http.post<any>(`${this.url}friend/addfriend/`, formdata);
  }
  getallfriend(id:any):Observable<any>{
    // console.log(id);
    return this.http.get<any>(`${this.url}friend/allfriend/${id}`) // lấy tất cả bạn của user theo id (đã kết bạn hoặc chưa kết bạn) trả về bảng friend
  }
  timbancuaban(id:any[]):Observable<any>{
    return this.http.post<any>(`${this.url}friend/laytatcabancuauser/`,id)  // lấy tất cả bạn của mảng id  trả về bảng friend
  }
  getusernewfeed(id:any,page:any):Observable<any>{
    // console.log(typeof id);
    return this.http.post<any>(`${this.url}friend/getallfriendnewfeed/${id}`,page) // lấy tất cả bảng friend có id   trả về bảng friend
  }
  timbancuaminh(id:any):Observable<any>{
    // console.log(typeof id);
    return this.http.get<any>(`${this.url}friend/getallfriendbyuser/${id}`) // lấy tất cả bảng friend có id   trả về bảng friend
  }
  
  laythongtinfriendbyuser(id:any):Observable<any>{
    // console.log(typeof id);
    return this.http.get<any>(`${this.url}friend/getallfriendbyuerr/${id}`) // lấy thông tin đầy đủ của tất cả bạn từ id trả về mảng user
  }
  acpfriend(id:any):Observable<any>{
    // console.log(typeof id);
    return this.http.put<any>(`${this.url}friend/acpfriend/`,id)
  }
  huyloimoi(id:any):Observable<any>{
    // console.log(typeof id);
    return this.http.delete<any>(`${this.url}friend/cancelloimoi/${id}`)
  }
  updatelastPostTimeUser(id:any):Observable<any>{
    return this.http.put<any>(`${this.url}friend/updatelastPostTimeUser`,id)
  }

  
}
