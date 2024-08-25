import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Friendservice } from '../service/friend.service';
import { SocketIoService } from '../service/socketio.service';
import { Postservice } from '../service/post.service';
import { Userservice } from '../service/userservice';
import { Likeservice } from '../service/like.service';


@Injectable({
  providedIn: 'root'
})
export class PostBehaviorSubject {
    arrid_friend!:any[]
    arid_folowing!:any[]
    id_me!:any;
    arrpost!:any[]
    arrpost2!:any
    arrpost3!:any


    arruser!:any[]
    arruser2!:any
    arruser3!:any
    // arrlikepost!:any;
    post!:any;
    arrlike!:any



  // listuserhoanchinh!:any
  constructor(
    private Userservice:Userservice,
    private Likeservice:Likeservice,
    private Postservice:Postservice,
    private http:HttpClient,private friendservice:Friendservice, private socketservice:SocketIoService){
      this.arridfriend$.subscribe(data =>{
        this.arrid_friend = data
      })
      this.arriduser$.subscribe(data =>{
        this.arid_folowing = data
      })
  }

  
  private url = 'http://192.168.2.39:3001/'

  private allpost = new BehaviorSubject<any>('');
  listallpost$ = this.allpost.asObservable();

  private arridfriend = new BehaviorSubject<any>('');
  arridfriend$ = this.arridfriend.asObservable();

  private arriduser = new BehaviorSubject<any>('');
  arriduser$ = this.arriduser.asObservable();
  private arrlikepost = new BehaviorSubject<any>('');
  arrlikepost$ = this.arrlikepost.asObservable();


  setarridfriend(id_user:any){
    this.arridfriend.next(id_user)
    // this.arrid_friend = id_user
    this.getpostbyfriend()
  }
  setarridfolowing(id_folowing:any){
    // this.arid_folowing = id_folowing
    this.arriduser.next(id_folowing)

    this.getpostbyuser()
  }

  getpostbyfriend(){
    this.arridfriend$.subscribe(data =>{
      this.arrid_friend = data
    // console.log(this.arrid_friend)
    if(this.arrid_friend[0] !== null && this.arrid_friend.length>0){
      this.Postservice.getpostbyfriend(this.arrid_friend).subscribe(data =>{
        // console.log(data);
           this.arrpost  = data
           this.ispost()

      
       

      })
    }else{
        this.arrpost =[]
    }
      if(this.arrid_friend[0] !== null && this.arrid_friend.length>0){
      this.Userservice.getuserbyarrid(this.arrid_friend).subscribe(datas =>{
        // console.log(datas)
        if(datas){
            // this.arruser.push(datas)
            this.arruser = datas
            this.ispost()

        }
      })
    }else{
        this.arruser=[]
    }
     
  })
}
  getpostbyuser(){
    this.arriduser$.subscribe(data =>{
      this.arid_folowing = data
    // console.log(this.arid_folowing)
    if(this.arid_folowing[0] !== null  && this.arid_folowing.length>0){
      this.Postservice.getpostbyfolowinf(this.arid_folowing).subscribe(data =>{
        // console.log(data);
            // this.arrpost.push(data)
            this.arrpost2 = data
            this.ispost()

      })
    }else{
        this.arrpost2 =[]
    }
      if(this.arid_folowing[0] !==null && this.arid_folowing.length>0){
      this.Userservice.getuserbyarrid(this.arid_folowing).subscribe(datas =>{
        // console.log(datas)
        if(datas){
            // this.arruser.push(datas)
            this.arruser2 = datas
            this.ispost()

        }

      })
    }else{
        this.arruser2 =[]
    }
     
  })
}

getlike(){
  this.Likeservice.getalllikeme(this.id_me,this.arrlike).subscribe(data =>{
    this.arrlikepost.next(data)
  })
}

  ispost(){
    // console.log(this.arrpost);
    // console.log(this.arruser);
    // console.log(this.arrpost2);
    // console.log(this.arruser2);
    // console.log(this.arid_folowing.length)
    // console.log(this.arrid_friend.length);
    this.arrpost3 = [...this.arrpost, ...this.arrpost2];
    this.arruser3 = [...this.arruser, ...this.arruser2];
    // console.log(this.arrpost3);

    const postArray = this.arrpost3.filter((item:any, index:any, self:any) =>
        index === self.findIndex((t:any) => t._id === item._id)
      );
      const arrlike = postArray.map((item:any) => item._id);
      // console.log(arrlike);
      this.arrlike = arrlike;
      this.id_me = localStorage.getItem('id_user');
      // console.log(this.id_me)

      this.getlike()
      const userArray = this.arruser3.filter((item:any, index:any, self:any) =>
        index === self.findIndex((t:any) => t._id === item._id)
      );
    
    // console.log(postArray);
    // console.log(userArray);
    let arrpost:any[] =[]
    postArray.forEach((post:any) => {
        userArray.forEach((user:any) =>{
          if(post.id_user === user._id){
              arrpost.push({
                id_post:post._id,
                id_user:user._id,
                avatar:user.avatar,
                username:user.username,
                date:post.date.split('T')[0],
                content:post.content,
                image:post.image,
                totallike:post.totallike,
                totalcomment:post.totalcomment,
                totalshare:post.totalshare,
                ishover:false,

              })
          }
        })
    });
    // console.log(arrpost);
    // console.log(this.arruser3);
    // this.allpost.next(arrpost)
    this.post = arrpost
    this.graftlikepost()
  }

  graftlikepost() {
    this.arrlikepost$.subscribe(likes => {
      // console.log(likes)

      const okla = this.post.map((post: any) => {
        const like = likes.find((like: any) => post.id_post === like.id_post);
        return {
          id_post: post.id_post,
          id_user: post.id_user,
          avatar: post.avatar,
          username: post.username,
          date: post.date.split('T')[0],
          content: post.content,
          image: post.image,
          totallike: post.totallike,
          totalcomment: post.totalcomment,
          totalshare: post.totalshare,
          ishover: false,
          typelike: like ? like.type : 0, // Set `typelike` if `like` exists, otherwise null
        };
      });
      
      // console.log(okla);
      this.allpost.next(okla); // Emit the result to `allpost` BehaviorSubject
    });
  }
  
  // list id user
  



}
