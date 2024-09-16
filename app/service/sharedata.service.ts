import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class Sharedataservice {
  constructor(private http:HttpClient){}

  private url = 'http://192.168.2.39:3001/'
  private emailsubject = new BehaviorSubject<string>('');
  email$ = this.emailsubject.asObservable();
  private storysubject = new BehaviorSubject<any>([]);
  story$ = this.storysubject.asObservable();

  private searchuser = new BehaviorSubject<any[]>([]);
  usersearch$ = this.searchuser.asObservable()
;
// private url = 'http://172.16.103.22:3001/'

  private searchpost = new BehaviorSubject<string>('');
  postsearc$ = this.searchpost.asObservable();

  urls(){
    return this.url
  }


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

  setstory(arrstory:any){
    this.storysubject.next(arrstory);
  }

  timkiembaiviet(key:string){
    this.searchpost.next(key)
  }
}
