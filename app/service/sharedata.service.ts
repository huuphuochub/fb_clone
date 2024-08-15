import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class Sharedataservice {
  constructor(private http:HttpClient){}

  private url = 'http://localhost:3001/';
  private emailsubject = new BehaviorSubject<string>('');
  email$ = this.emailsubject.asObservable();

  private searchuser = new BehaviorSubject<any[]>([]);
  usersearch$ = this.searchuser.asObservable()
;


  private searchpost = new BehaviorSubject<string>('');
  postsearc$ = this.searchpost.asObservable();


  timkiemuser(key:any):Observable<any>{
    const ok = {username:key}
    // console.log(ok)
    return this.http.post<any>(`${this.url}user/search`, ok);
  }


  setEmailsubject(email: string) {
    this.emailsubject.next(email);
  }
  timkiemban(key:string){
    // console.log(key)
    this.timkiemuser(key).subscribe(data =>{
      this.searchuser.next(data);
      // console.log(data);

    })
  }



  timkiembaiviet(key:string){
    this.searchpost.next(key)
  }
}
