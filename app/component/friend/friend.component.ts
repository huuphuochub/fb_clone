import { Component,OnInit } from '@angular/core';
import { Friendservice } from '../../service/friend.service';
import { MeBehaviorSubject } from '../../BehaviorSubject/me.BehaviorSubject';
import { Userservice } from '../../service/userservice';
import { Messengerservice } from '../../service/messenger.service';
import { Notificationservice } from '../../service/notification.service';
import { SocketIoService } from '../../service/socketio.service';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrl: './friend.component.css'
})
export class FriendComponent implements OnInit{
  id_user!:any
  alluser!:any;
  current:String =''
  tatcaban!:any
  users!:any;
  user!:any;
constructor(private Friendservice:Friendservice,
  private SocketIoService:SocketIoService,
  private Notificationservice:Notificationservice,
  private Messengerservice:Messengerservice,
  private Userservice:Userservice,
private MeBehaviorSubject:MeBehaviorSubject,

){}

  ngOnInit(): void {
    this.current ='banbe'
    const id_user = localStorage.getItem('id_user')
  this.id_user = id_user
  this.Userservice.getuser(this.id_user).subscribe(data=>{
    this.user = data
  })
    this.loadfriend()
  }
  loadfriend(){
    this.Friendservice.getallfriend(this.id_user).subscribe(data =>{
      const arrid = data.map((item:any) =>  item.id_user1 === this.id_user ? item.id_user2 : item.id_user1)
      console.log(data)
      console.log(arrid);
      this.Userservice.getuserbyarrid(arrid).subscribe(datas=>{
        this.MeBehaviorSubject.compressionuser(datas)

      })
      
      this.laythongtin()
      
    })
  }
  laythongtin(){
    this.current ='banbe'

    this.MeBehaviorSubject.alluser$.subscribe(data =>{
      console.log(data)
      this.tatcaban = data
      this.alluser = this.tatcaban.filter((item:any) => item.status === 3)

    })
  }
  loimoiketban(){
    this.alluser = this.tatcaban.filter((item:any) =>item.status === 1)
    this.current ='loimoikb'

  }
  daguiloimoi(){
    this.alluser = this.tatcaban.filter((item:any) => item.status === 2)
    this.current ='daguiloimoi'
  }


  acpfriend(id:any,id_users:any){
    // console.log(id)
    this.Userservice.getuser(id_users).subscribe(data =>{
      this.users = data
      console.log(data);
      this.handleacp(id,id_users)
    })
    
  
  
  }
  
  handleacp(id:any,id_users:any){
    let formdata = new FormData()
    formdata.append('id_friend',id);
    this.Friendservice.acpfriend(formdata).subscribe(data=>{
      if(data == true){
        this.loadfriend();
      }
    })
    if(this.users){
      const formdata = new FormData()
      const content = `${this.user.username} đã chấp nhân lời mời kết bạn`
      formdata.append('id_user',id_users);
      formdata.append('content', content);
      formdata.append('type', 'friend');
      this.Notificationservice.addnotification(formdata).subscribe(data=>{
        this.SocketIoService.sendNotificationfriend(id_users,content)
      })
    const dataroom = {
        id_user:[
          this.id_user,
          id_users
        ],
        name:this.user.username,
        type:1,
        lastmess:'xin chào, hãy nhắn tin với mình'
      
    }
      this.Messengerservice.addromchat(dataroom).subscribe(data =>{
        console.log(data)
      })
    }
  }


}
