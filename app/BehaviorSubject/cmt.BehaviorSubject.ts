import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Friendservice } from '../service/friend.service';
import { SocketIoService } from '../service/socketio.service';
import { Postservice } from '../service/post.service';
import { Userservice } from '../service/userservice';
import { Likeservice } from '../service/like.service';
import { Commentservice } from '../service/comment.service';


@Injectable({
  providedIn: 'root'
})
export class CmtBehaviorSubject {
    posts!:any;
    arriduser!:any;
    comments!:any;
    allcmts!:any
    constructor(private postservice:Postservice,private Userservice:Userservice,private Commentservice:Commentservice){}
   
    private allcmt = new BehaviorSubject<any>('');
    allcmt$ = this.allcmt.asObservable();

    private post = new BehaviorSubject<any>('');
    post$ = this.post.asObservable();

    getcmtbypost(id:any){
        this.postservice.getpostbyid(id).subscribe(data =>{
           this.posts = data
        //    console.log(data)
        //    console.log(this.posts.id_user)
           this.getuserpost()
        })
        this.Commentservice.getcommentbypost(id).subscribe(data =>{
            this.comments = data
            // console.log(data)
            const hahha = data.map((item:any) => item.id_user)
            // console.log(hahha)
            this.arriduser = hahha
            this.loaduserandcmt()
          })
    }
    getuserpost(){
        let  ok =this.posts.id_user
       
        this.Userservice.getuser(ok).subscribe(data =>{
            console.log(data)
            let okla = {
                id_post :this.posts._id,
                id_user:data._id,
                avatar:data.avatar,
                username:data.username,
                content:this.posts.content,
                date:this.posts.date.split('T')[0],
                image:this.posts.image,
                totallike: this.posts.totallike,
                totalcomment: this.posts.totalcomment,
                totalshare: this.posts.totalshare,
                ishover: false,
            }
            this.post.next(okla)
        })

       
    }
    loaduserandcmt(){
        if(this.arriduser.length >0 && this.comments.length>0){
    
            this.Userservice.getuserbyarrid(this.arriduser).subscribe(data =>{
              // console.log(data)
              const okakjs = this.comments.map((cmt:any)=>{
               const hahahah= data.find((user:any) => cmt.id_user === user._id)
                  return{
                    id_user:cmt.id_user,
                    avatar:hahahah.avatar,
                    username:hahahah.username,
                    date:cmt.date.split("T")[1],
                    content:cmt.content,
                    image:cmt.image
        
        
                  }
              })
        this.allcmt.next(okakjs);
        // console.log(okakjs)
            })
          }else{
            this.allcmts =[]
            this.allcmt.next([]);

          }
    }




}
