import { Component,OnInit } from '@angular/core';
import { timer } from 'rxjs';

import { catchError, finalize, switchMap } from 'rxjs/operators';
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
import { Storyservice } from '../../service/story.service';
import { CmtBehaviorSubject } from '../../BehaviorSubject/cmt.BehaviorSubject';
import { LikeBehaviorSubject } from '../../BehaviorSubject/like.BehaviorSubject';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  formcomment!:FormGroup;

  constructor(
    private LikeBehaviorSubject:LikeBehaviorSubject,
    private CmtBehaviorSubject:CmtBehaviorSubject,
    private Likeservice:Likeservice,
    private Storyservice:Storyservice,
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
  formstory:boolean=false;
  selectedFile!:any;
  video!:any;
  isloading:boolean = false;
  storymes!:any
  storyme!:any;
  iduserstory:any[] =[];
  story!:any;
  opencamxuc:boolean = false
  userlike!:any;
  openforminteract:boolean=false;
  userlikes!:any;
  userpost!:any;
  currentseen:any ='tatca';
 




  ngOnInit(): void {
    this.activeStateService.setCurrentPage('home');
    this.id_user = localStorage.getItem('id_user');
   
    // console.log(typeof this.id_user);
    this.userservice.getuser(this.id_user).subscribe(data =>{
      this.profileuser = data;
      console.log(data)
      
      // console.log(data);
                this.loadban()

      
    })
    this.Storyservice.getstorybyme(this.id_user).subscribe(data =>{
  this.storymes = data
  // console.log(data)
  this.storyme = data[0]
  // console.log(this.storyme)
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
      // const iduserstory = new Set(this.arridfolowing)
      // console.log(this.arridfolowing);
      
      this.iduserstory = [...this.arridfolowing];
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
      // this.iduserstory.push(this.arriddfriend)
      // const iduserstory = new Set(this.arriddfriend)
      this.iduserstory = [...this.iduserstory, ...this.arriddfriend]
      this.PostBehaviorSubject.setarridfriend(this.arriddfriend);
      this.getnewfeed()
      const arr = [...new Set(this.iduserstory.filter(item => item !== null))];
    // console.log(arr);
    
      if(arr.length>0){
        this.Storyservice.getstorybyariduser(arr).subscribe(data=>{
          // console.log(data)
          this.story = data
          this.Sharedataservice.setstory(data);
        })
      }


    })
    // localStorage.clear() 
     
  }
  onScroll(){
    console.log('ê tao load lại nha')
  }

  handlecomment(){
    // console.log(this.formcomment.get('content')?.value)

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
        formthongbao.append('type','post')
        this.Notificationservice.addnotification(formthongbao).subscribe(data =>{
          // console.log(data);
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
  openformstory(){
   
      if(this.storymes.length > 0){
        alert('bạn đã đăng 1 story gần đây, mỗi ngày chỉ đc đăng 1');
        return
      }else{
        this.formstory = true

      }
  }
closeformstory(){
  this.formstory = false
}

handlepoststory(){
  
  if(!this.selectedFile){
    alert('vui lòng thêm video vào story')
    // console.log(this.profileuser.username);
    // console.log(this.profileuser.avatar);
    
    
    return;
  }else{
    this.isloading = true;
    const formdata = new FormData()
    formdata.append('id_user', this.id_user);
    formdata.append('username', this.profileuser.username);
    formdata.append('avatar', this.profileuser.avatar);
    formdata.append('video', this.selectedFile);
    formdata.append('totalview', '0');
    formdata.append('status' ,'1');
    this.Storyservice.addstory(formdata)
    .pipe(
      catchError((error:any) =>{
        console.error('eroor');
        return '';
      }),
      finalize(() =>{
        this.isloading = false
      })
    )
    .subscribe(data =>{
      // console.log(data)
      this.closeformstory();
    })
  }
 
  
}
onFileChange(event: any) {
  const file = event.target.files[0];
  // console.log(file)
  if (file) {
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.video = e.target.result;
    };
    reader.readAsDataURL(file);

  }
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
    // console.log(type);
    const fomdata = new FormData()
    fomdata.append('id_post',id_post),
    fomdata.append('id_user',this.id_user);
    fomdata.append('type',type)
    this.Likeservice.addlike(fomdata).subscribe(data =>{
      // console.log(data)
      this.PostBehaviorSubject.getpostbyfriend()
      this.PostBehaviorSubject.getpostbyuser
      this.PostBehaviorSubject.getlike()
      const thongbao = `${this.profileuser.username} vừa thả cảm xúc về bài viết của bạn`;

      this.socketservice.sendNotification(id_user,thongbao)
      const formthongbao = new FormData()
      formthongbao.append('id_user',id_user),
      formthongbao.append('content',thongbao);
      formthongbao.append('id_post', id_post)
      formthongbao.append('type', 'post')
      this.Notificationservice.addnotification(formthongbao).subscribe(data =>{
        // console.log(data);
      })

    })
  }
  deletelike(id_post:any){
    // console.log(id_post)
    const fomdata = new FormData()
    fomdata.append('id_post',id_post),
    fomdata.append('id_user',this.id_user);
    this.Likeservice.deletelike(fomdata).subscribe(data=>{
      // console.log(data);
      this.PostBehaviorSubject.getpostbyfriend()
      this.PostBehaviorSubject.getpostbyuser
      this.PostBehaviorSubject.getlike()
    })
  }
  mobinhluan(id:any,id_user:any){
    // console.log(this.allpostnewfeed)
    this.CmtBehaviorSubject.getcmtbypost(id)
    this.CmtBehaviorSubject.post$.subscribe(data =>{
      this.post = data
        })
    this.id_user_post = id_user
    this.id_post = id
    this.openbinhluan = true
    this.CmtBehaviorSubject.allcmt$.subscribe(data =>{
      this.allcmt = data
    })


  }

  dongbinhluan(){
    this.openbinhluan = false
  }
  openinteract(id:any,id_user:any){
    // console.log(id)
    this.Postservice.getpostbyid(id).subscribe(data =>{
      this.post=data
    })
    this.userservice.getuser(id_user).subscribe(data =>{
      this.userpost = data
    })
    this.LikeBehaviorSubject.setidpost(id)
    this.loadlike()
  }
  loadlike(){
    this.LikeBehaviorSubject.like$.subscribe(data =>{
      // console.log(data)
      this.userlikes = data
      this.userlike = this.userlikes
     

      this.openforminteract=true
    })
  }
  dong(){
    this.openforminteract = false
  }
  tatca(){
    this.userlike = this.userlikes
    this.currentseen = 'tatca'
  }
  seenlike(){
    this.userlike = this.userlikes.filter((item:any) => item.type === 1)
    this.currentseen = 'like'
  }
  seenfavorite(){
    this.userlike = this.userlikes.filter((item:any) => item.type === 2)
    this.currentseen = 'favorite'
  }
  seenhaha(){
    this.userlike = this.userlikes.filter((item:any) => item.type === 3)
    this.currentseen = 'haha'
  }
  seensaid(){
    this.userlike = this.userlikes.filter((item:any) => item.type === 4)
    this.currentseen = 'said'
  }
  seenangry(){
    this.userlike = this.userlikes.filter((item:any) => item.type === 5)
    this.currentseen = 'angry'
  }
  seenwow(){
    this.userlike = this.userlikes.filter((item:any) => item.type === 6)
    this.currentseen = 'wow'
  }


}
