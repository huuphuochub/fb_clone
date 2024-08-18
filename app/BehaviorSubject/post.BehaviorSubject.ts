import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Friendservice } from '../service/friend.service';
import { SocketIoService } from '../service/socketio.service';


@Injectable({
  providedIn: 'root'
})
export class PostBehaviorSubject {

  // listuserhoanchinh!:any
  constructor(private http:HttpClient,private friendservice:Friendservice, private socketservice:SocketIoService){
    
  }

  private url = 'http://localhost:3001/';


  // list id user
  



}
