import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Friendservice } from '../service/friend.service';
import { SocketIoService } from '../service/socketio.service';
import { Postservice } from '../service/post.service';
import { Userservice } from '../service/userservice';
import { Likeservice } from '../service/like.service';
import { Commentservice } from '../service/comment.service';
import { UserBehaviorSubject } from './user.BehaviorSubject';


@Injectable({
  providedIn: 'root'
})
export class LikeBehaviorSubject {

    arriduser:any[]=[]
    listlike!:any
   constructor(private Likeservice:Likeservice, private Userservice:Userservice, private UserBehaviorSubject:UserBehaviorSubject){}

private likepost = new BehaviorSubject<any[]>([])
like$ = this.likepost.asObservable()


setidpost(id:any){
    this.Likeservice.getlikebypost(id).subscribe(data =>{
        // console.log(data)
        this.listlike = data
        this.arriduser = data.map((item:any) => item.id_user)
        // console.log(this.arriduser.length)
        if(this.arriduser.length>0){
            this.Userservice.getuserbyarrid(this.arriduser).subscribe(datas =>{
                // console.log(datas)
                this.UserBehaviorSubject.compressionuser(datas)
                this.loaduserlike()
            })
        }else{
            this.loaduserlike()
        }
    })
}
loaduserlike(){
    if(this.arriduser.length>0){
    this.UserBehaviorSubject.alluser$.subscribe(data =>{
        // console.log(data)
        let arr:any[] =[]
        this.listlike.forEach((like:any) =>{
            data.forEach((user:any) =>{
                if(like.id_user === user._id){
                    arr.push({
                        id_user:user._id,
                        username:user.username,
                        avatar:user.avatar,
                        banchung:user.banchung,
                        online:user.online,
                        status:user.status,
                        type:like.type,
                        date:like.date
                    })
                }
            })
        })
        this.likepost.next(arr)
    })
}else{
    this.likepost.next([])

}
}
}
