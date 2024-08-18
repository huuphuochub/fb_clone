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


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(private Postservice:Postservice, private Folowerservice:Folowerservice, private MeBehaviorSubject:MeBehaviorSubject, private UserBehaviorSubject:UserBehaviorSubject,private router:Router,private activeStateService: ActiveStateService, private userservice:Userservice, private friendservice:Friendservice, private socketservice:SocketIoService, private Sharedataservice:Sharedataservice) {}

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


  ngOnInit(): void {
    this.activeStateService.setCurrentPage('home');
    this.id_user = localStorage.getItem('id_user');
   
    // console.log(typeof this.id_user);
    this.userservice.getuser(this.id_user).subscribe(data =>{
      this.profileuser = data;
                this.loadban()

      
    })
    this.Folowerservice.getfolowerbyuser(this.id_user).subscribe(data =>{
      console.log(data);
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
      console.log(this.arridfolowing);
    })
    this.friendservice.timbancuaminh(this.id_user).subscribe(data =>{
      console.log(data);
    this.arriddfriend =  data.map((item:any) =>{
          if(item.id_user1 === this.id_user){
            return item.id_user2
          }else{
            return item.id_user1
          }
     } )
      console.log(this.arriddfriend);
      this.getnewfeed()

    })
    // localStorage.clear()  
  }

  getnewfeed(){
    const arriduser = [...new Set([...this.arriddfriend, ...this.arridfolowing])]
    console.log(arriduser);
    this.userservice.getuserbyarrid(arriduser).subscribe(data =>{
      console.log(data);
      this.arruserpost=data;
    })
    this.Postservice.getpostbyfriend(this.arriddfriend).subscribe(data =>{
      console.log(data);
      this.postbyfriend = data
      
    })
    this.Postservice.getpostbyfolowinf(this.arridfolowing).subscribe(data =>{
      console.log(data)
      this.postbyfolowing = data;
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
  

  onMouseEnter() {
    // Thiết lập thời gian hiển thị popup sau 3 giây
    this.hoverTimer = setTimeout(() => {
      this.showPopup = true;
    }, 1000);
  }

  onMouseLeave() {
    // Hủy bỏ thời gian nếu chuột rời khỏi trước khi hết thời gian
    clearTimeout(this.hoverTimer);
    this.showPopup = false;
    

    
  }
  mobinhluan(){
    this.openbinhluan = true
  }
  dongbinhluan(){
    this.openbinhluan = false
  }


}
