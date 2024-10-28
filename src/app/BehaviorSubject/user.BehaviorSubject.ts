import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Friendservice } from '../service/friend.service';
import { SocketIoService } from '../service/socketio.service';


@Injectable({
  providedIn: 'root'
})
export class UserBehaviorSubject {
  private id_user!:any
  allloimoi!:any;
  listuser!:any;
  bancuaban!:any;
  bancuaminh!:any;
  datauser!:any
  idfriendonline!:any;
  isfriendonline:any[] =[];
  profilefriend!:any
  // listuserhoanchinh!:any
  constructor(private http:HttpClient,private friendservice:Friendservice, private socketservice:SocketIoService){
      this.idlistfriend$.subscribe(data=>{
        this.idfriendonline = data
        // console.log(data)
      })
  }

  // private url = 'https://huuphuoc.test.huuphuoc.id.vn/'

  // private url = 'http://192.168.2.39:3001/'
  private url = 'http://localhost:3001/'


  // list id user
  private arridlistfriend = new BehaviorSubject<string>('');
  idlistfriend$ = this.arridlistfriend.asObservable();

  setidlistfriend(arr: string) {
    // console.log(arr)
    this.arridlistfriend.next(arr);
  }
  //  email ///////////////////////
  private emailsubject = new BehaviorSubject<string>('');
  email$ = this.emailsubject.asObservable();

  setEmailsubject(email: string) {
    this.emailsubject.next(email);
  }


  //  alluser ////////////////////////////

  private alluser = new BehaviorSubject<any>('');
  alluser$ = this.alluser.asObservable();

  compressionuser(data:any){
    this.datauser = data
    this.id_user = localStorage.getItem('id_user');
    this.fetchtatcaloimoi()
  }

  fetchtatcaloimoi(){
    this.friendservice.getallfriend(this.id_user).subscribe(data =>{
      // console.log(data)
      this.allloimoi = data
      this.xulydulieu()
    })
  }


  xulydulieu(){
    const allusers = this.datauser.map((user: any) => {
        let status = 0;
        let id_friend = '';

        if (user._id === this.id_user) {
            status = 4;
        } else {
            const add = this.allloimoi.find((add: any) => 
                (user._id === add.id_user1 && add.id_user2 === this.id_user && add.status === 1) ||
                (user._id === add.id_user2 && add.id_user1 === this.id_user && add.status === 1) ||
                ((user._id === add.id_user2 && add.id_user1 === this.id_user && add.status === 2) ||
                 (user._id === add.id_user1 && add.id_user2 === this.id_user && add.status === 2))
            );

            if (add) {
                if (add.status === 1) {
                    status = (user._id === add.id_user1) ? 1 : 2;
                } else if (add.status === 2) {
                    status = 3;
                }
                id_friend = add._id;
            }
        }

        return {
            _id: user._id,
            username: user.username,
            avatar: user.avatar,
            status: status,
            id_friend: id_friend,
            email: user.email,
        };
    });

    this.listuser = allusers;
    this.timbanchung();
}


  


  timbanchung(){
    const arrid :any[] =[]
    this.listuser.forEach((item:any)=>{
      arrid.push(item._id)
    })
    // console.log(arrid);
    this.friendservice.timbancuaban(arrid).subscribe(data=>{
      this.bancuaban = data
      this.timbancuaminh();
    })
  }
  timbancuaminh(){
    // console.log( typeof this.id_user)
    this.friendservice.timbancuaminh(this.id_user).subscribe(data =>{
      this.bancuaminh = data
      this.xulydulieubanchung()
    })
  }
  xulydulieubanchung(){

    let allhoanchinhnhat:any[] =[]
   const mangarr :any[] =[]
   
     this.bancuaminh.forEach((item:any)=>{
       mangarr.push(item.id_user1);
       mangarr.push(item.id_user2)
   
     })
   
     // console.log(mangarr);
   
     const uniqueArray = [...new Set(mangarr)];
     // console.log(uniqueArray);
     const ok =uniqueArray.filter(item => item !== this.id_user)
     // console.log(ok); //bancuaminh
   
     this.listuser.forEach((mag:any) =>{
       let banchung =0
      if(mag._id !== this.id_user){
         this.bancuaban.forEach((bancuaban:any)=>{
           let okla = ''
           if(mag._id === bancuaban.id_user1){
             okla = bancuaban.id_user2
             if(okla !== this.id_user){
               ok.forEach((bancuaminh)=>{
                 if(okla === bancuaminh){
                   banchung +=1;
                 }
               })
             }
           }else if(mag._id === bancuaban.id_user2){
               okla = bancuaban.id_user1;
               if(okla !== this.id_user){
                 ok.forEach((bancuaminh)=>{
                   if(okla === bancuaminh){
                     banchung+=1
                   }
                 })
               }
           }
         })
       }
      allhoanchinhnhat.push({
       id_friend:mag.id_friend,
       _id:mag._id,
       username:mag.username,
       avatar:mag.avatar,
       status:mag.status,
       banchung:banchung,
      })
     
     })
   
   
   
  //  console.log(allhoanchinhnhat)
   this.profilefriend = allhoanchinhnhat
  //  this.alluser.next(allhoanchinhnhat)

  //  this.alluser.next(allhoanchinhnhat)
    //  this.listuserhoanchinh = allhoanchinhnhat;
    // this.loadban()
    this.friendonline()
   }




   friendonline() {
    this.idlistfriend$.subscribe(data => {
        this.idfriendonline = data;
        // console.log('idfriendonline:', data);

        let arr: any[] = [];
        // console.log('profilefriend:', this.profilefriend);

        if (this.idfriendonline && this.profilefriend) {
            this.profilefriend.forEach((friend: any) => {
                let online = 0;
                this.idfriendonline.forEach((idfriendonlines: any) => {
                    if (friend._id === idfriendonlines) {
                        online = 1;
                    }
                });

                arr.push({
                    _id: friend._id,
                    id_friend: friend.id_friend,
                    username: friend.username,
                    avatar: friend.avatar,
                    online: online,
                    banchung: friend.banchung,
                    status: friend.status,
                });
            });
        }

        this.isfriendonline = arr;
        // console.log('Danh sách bạn bè với trạng thái online:', arr);

        // Thực hiện các hành động khác sau khi đã cập nhật isfriendonline
        this.alluser.next(arr);
    });
}












// search post ////////////////////////////////


  private searchpost = new BehaviorSubject<string>('');
  postsearc$ = this.searchpost.asObservable();

  //  search user //////////////////////////

  private searchuser = new BehaviorSubject<any[]>([]);
  usersearch$ = this.searchuser.asObservable();

  timkiemuser(key:any):Observable<any>{
    const ok = {username:key}
    // console.log(ok)
    return this.http.post<any>(`${this.url}user/search/`, ok);
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


  // list id user




}
