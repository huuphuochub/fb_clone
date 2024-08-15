import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';




@Injectable({
  providedIn: 'root'
})
export class FriendBehaviorSubject {
  constructor(private http:HttpClient){}

  private url = 'http://localhost:3001/';

  //  email ///////////////////////
  private emailsubject = new BehaviorSubject<string>('');
  email$ = this.emailsubject.asObservable();

  setEmailsubject(email: string) {
    this.emailsubject.next(email);
  }


  //  alluser ////////////////////////////

  private alluser = new BehaviorSubject<string>('');
  alluser$ = this.alluser.asObservable();







// search post ////////////////////////////////


  private searchpost = new BehaviorSubject<string>('');
  postsearc$ = this.searchpost.asObservable();

  //  search user //////////////////////////

  private searchuser = new BehaviorSubject<any[]>([]);
  usersearch$ = this.searchuser.asObservable();

  timkiemuser(key:any):Observable<any>{
    const ok = {username:key}
    // console.log(ok)
    return this.http.post<any>(`${this.url}user/search`, ok);
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

  
  private arridlistfriend = new BehaviorSubject<string>('');
  idlistfriend$ = this.arridlistfriend.asObservable();

  setidlistfriend(arr: string) {
    this.arridlistfriend.next(arr);
  }
}
