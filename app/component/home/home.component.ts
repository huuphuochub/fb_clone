import { Component,OnInit } from '@angular/core';
import { timer } from 'rxjs';

import { switchMap } from 'rxjs/operators';
import { ActiveStateService } from '../../service/active-state.service';
import { Userservice } from '../../service/userservice';
import { Friendservice } from '../../service/friend.service';
import { SocketIoService } from '../../service/socketio.service';
import { NavigationEnd, Router } from '@angular/router';
import { Sharedataservice } from '../../service/sharedata.service';
import { UserBehaviorSubject } from '../../BehaviorSubject/user.BehaviorSubject';
import { MeBehaviorSubject } from '../../BehaviorSubject/me.BehaviorSubject';
import { Folowerservice } from '../../service/folower.service';
import { Postservice } from '../../service/post.service';
import { PostBehaviorSubject } from '../../BehaviorSubject/post.BehaviorSubject';
import { Likeservice } from '../../service/like.service';
import { Notificationservice } from '../../service/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Commentservice } from '../../service/comment.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  formcomment!:FormGroup;

  constructor(
    private Likeservice:Likeservice,
    private Commentservice:Commentservice,
    private formbuilder:FormBuilder,
    private Notificationservice:Notificationservice,
    private PostBehaviorSubject:PostBehaviorSubject,
    private Postservice:Postservice, private Folowerservice:Folowerservice, private MeBehaviorSubject:MeBehaviorSubject, private UserBehaviorSubject:UserBehaviorSubject,private router:Router,private activeStateService: ActiveStateService, private userservice:Userservice, private friendservice:Friendservice, private socketservice:SocketIoService, private Sharedataservice:Sharedataservice)
    
    {
      this.formcomment = this.formbuilder.group({
        content:['',Validators.required]
      })

    }

  position = 0;
  trove:boolean = false;
  showPopup = false;
  openbinhluan = false;
  private hoverTimer: any;
  profileuser!:any;
  id_user!:any
  bancuaminh!:any
  profilefriend!:any
  idfriendonline!:any;
  isfriendonline:any[] =[];
  listfolower!:any
  arriddfriend!:any[];
  arriduserpost!:any[];
  arridfolowing!:any;
  arruserpost!:any;
  postbyfriend!:any;
  postbyfolowing!:any;
  allpostnewfeed!:any;
  post!:any;
  comments!:any;
  arriduser!:any
  allcmt!:any
  id_post!:any;
  id_user_post!:any;


  ngOnInit(): void {
    this.activeStateService.setCurrentPage('home');
    this.id_user = localStorage.getItem('id_user');
   
    // console.log(typeof this.id_user);
    this.userservice.getuser(this.id_user).subscribe(data =>{
      this.profileuser = data;
                this.loadban()

      
    })
    this.Folowerservice.getfolowerbyuser(this.id_user).subscribe(data =>{
      // console.log(data);
      this.listfolower = data
      this.arridfolowing = data.map((item:any) =>{
        if(item.status === 1 && item.id_user1 === this.id_user){
          return item.id_user2
        }else if(item.status === 2 && item.id_user2 === this.id_user){
          return item.id_user1
        }else{
          return null;
        }
      }
          
      )

      this.PostBehaviorSubject.setarridfolowing(this.arridfolowing);
    })
    this.friendservice.timbancuaminh(this.id_user).subscribe(data =>{
      // console.log(data);
    this.arriddfriend =  data.map((item:any) =>{
          if(item.id_user1 === this.id_user){
            return item.id_user2
          }else if(item.id_user2 === this.id_user){
            return item.id_user1
          }else{
            return null
          }
     } )
      // console.log(this.arriddfriend);
      this.PostBehaviorSubject.setarridfriend(this.arriddfriend);
      this.getnewfeed()

    })
    // localStorage.clear()  
  }

  handlecomment(){
    console.log(this.formcomment.get('content')?.value)

    const fromdata = new FormData()
    fromdata.append('content',this.formcomment.get('content')?.value);
    fromdata.append('id_user',this.id_user);
    fromdata.append('id_post',this.id_post);

    this.Commentservice.addcomment(fromdata).subscribe(data =>{
      if(data === true){
        this.mobinhluan(this.id_post,this.id_user_post)
        const thongbao = `${this.profileuser.username} đã bình luận về bài viết của bạn`
        this.socketservice.sendNotification(this.id_user_post,thongbao)
        const formthongbao = new FormData()
        formthongbao.append('id_user',this.id_user_post),
        formthongbao.append('content',thongbao);
        formthongbao.append('id_post', this.id_post)
        this.Notificationservice.addnotification(formthongbao).subscribe(data =>{
          console.log(data);
        })
  
      }
    })


  }

  getnewfeed(){

    this.PostBehaviorSubject.listallpost$.subscribe(data =>{
      this.allpostnewfeed = data.reverse()
    })
  }




  loadban(){

    
    this.friendservice.laythongtinfriendbyuser(this.id_user).subscribe(data=>{
      this.profilefriend = data
      this.MeBehaviorSubject.compressionuser(data);
      // console.log(data)
      this.friendonline()

    })
 
    
  
  


  }
  friendonline(){
this.MeBehaviorSubject.alluser$.subscribe(data =>{
  // console.log(data);
        this.isfriendonline = data

})
  }

  
  togglePosition() {
    // Nếu vị trí là 100, thay đổi thành 0, nếu không thay đổi thành -100
    this.position = this.position -=720
    this.kiemtr()
  }
  quaylai(){
    this.position = this.position += 720
    this.kiemtr()
  }
  kiemtr(){
    if(this.position<0){
      this.trove = true
    }else if(this.position >=0){
      this.trove = false
    }
  }
  

  onMouseEnter(index:any) {
    // Thiết lập thời gian hiển thị popup sau 3 giây
    this.hoverTimer = setTimeout(() => {
      this.allpostnewfeed[index].ishover = true;
    }, 1000);
  } 

  onMouseLeave(index:any) {
    // Hủy bỏ thời gian nếu chuột rời khỏi trước khi hết thời gian
    clearTimeout(this.hoverTimer);
    this.allpostnewfeed[index].ishover = false;
    

    
  }
  handlelike(type:any,id_post:string,id_user:any){
    console.log(type);
    const fomdata = new FormData()
    fomdata.append('id_post',id_post),
    fomdata.append('id_user',this.id_user);
    fomdata.append('type',type)
    this.Likeservice.addlike(fomdata).subscribe(data =>{
      console.log(data)
      this.PostBehaviorSubject.getpostbyfriend()
      this.PostBehaviorSubject.getpostbyuser
      this.PostBehaviorSubject.getlike()
      const thongbao = `${this.profileuser.username} vừa thả cảm xúc về bài viết của bạn`;

      this.socketservice.sendNotification(id_user,thongbao)
      const formthongbao = new FormData()
      formthongbao.append('id_user',id_user),
      formthongbao.append('content',thongbao);
      formthongbao.append('id_post', id_post)
      this.Notificationservice.addnotification(formthongbao).subscribe(data =>{
        console.log(data);
      })

    })
  }
  deletelike(id_post:any){
    console.log(id_post)
    const fomdata = new FormData()
    fomdata.append('id_post',id_post),
    fomdata.append('id_user',this.id_user);
    this.Likeservice.deletelike(fomdata).subscribe(data=>{
      console.log(data);
      this.PostBehaviorSubject.getpostbyfriend()
      this.PostBehaviorSubject.getpostbyuser
      this.PostBehaviorSubject.getlike()
    })
  }
  mobinhluan(id:any,id_user:any){
    const ok =this.allpostnewfeed.filter((item:any) =>item.id_post === id)
    this.id_user_post = id_user
    // console.log(ok[0])
    this.id_post = id
    this.post = ok[0]
    this.openbinhluan = true
    this.Commentservice.getcommentbypost(id).subscribe(data =>{
      this.comments = data
      console.log(data)
      const hahha = data.map((item:any) => item.id_user)
      console.log(hahha)
      this.arriduser = hahha
      this.loaduserandcmt()
    })

  }
  loaduserandcmt(){
    console.log(this.arriduser.length !== 0 )
    console.log(this.comments);

    console.log(this.arriduser[0] !== null )
    if(this.arriduser.length >0 && this.comments.length>0){
    this.userservice.getuserbyarrid(this.arriduser).subscribe(data =>{
      console.log(data)
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
this.allcmt = okakjs;
console.log(okakjs)
    })
  }else{
    this.allcmt =[]
  }
  }
  dongbinhluan(){
    this.openbinhluan = false
  }


}
