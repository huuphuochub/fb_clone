import { Component,OnInit } from '@angular/core';
import { Friendservice } from '../../service/friend.service';
import { MeBehaviorSubject } from '../../BehaviorSubject/me.BehaviorSubject';
import { Userservice } from '../../service/userservice';
import { Messengerservice } from '../../service/messenger.service';
import { Notificationservice } from '../../service/notification.service';
import { SocketIoService } from '../../service/socketio.service';
import { Folowerservice } from '../../service/folower.service';

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
  private Folowerservice:Folowerservice,
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
  dangtheogioi(){
    this.current ='dangtheogioi'
    let arrfl:any[] =[]
    this.Folowerservice.getfolowerbyuser(this.id_user).subscribe(data=>{
      console.log(data)
      arrfl = data
      let arrid:any[] = []
      data.forEach((item:any) =>{
        if(item.id_user1 === this.id_user && item.status === 2 || item.status ===3){
          arrid.push(item.id_user2)
        }else if(item.id_user2 === this.id_user && item.status === 1 || item.status === 3 ){
          arrid.push(item.id_user1)
        }
      })
      if(arrid.length>0){
        this.Userservice.getuserbyarrid(arrid).subscribe(data =>{
          this.MeBehaviorSubject.compressionuser(data)
          console.log(data)
        })
      }else if(arrid.length === 0){
        this.alluser =[]
      }
    })
    this.MeBehaviorSubject.alluser$.subscribe(data =>{
      const ok =data.map((item:any) => {
        return({
          _id:item._id,
          username:item.username,
          status:item.status,
          online:item.online,
          id_friend:item.id_friend,
          banchung:item.banchung,
          avatar:item.avatar,
          folower:1
        })
       


    })
    console.log(ok)
    const akjshdkas: any[] = [];

    // Create a Set of IDs with status 3 for quick lookup
    const followerIdsWithStatus3 = new Set(
      arrfl
        .filter(fl => fl.status === 3)
        .flatMap(fl => [fl.id_user1, fl.id_user2])
    );
    
    ok.forEach((item: any) => {
      // Determine the follower status
      const isFollowerWithStatus3 = followerIdsWithStatus3.has(item._id);
    
      akjshdkas.push({
        _id: item._id,
        username: item.username,
        status: item.status,
        online: item.online,
        id_friend: item.id_friend,
        banchung: item.banchung,
        avatar: item.avatar,
        folower: isFollowerWithStatus3 ? 2 : 1
      });
    });
    
    // Assign the processed data to `this.alluser`
    this.alluser = akjshdkas;
    // this.alluser = ok
    })
  }
  datheogioi(){
    this.current ='datheogioi'

    this.Folowerservice.getfolowerbyuser(this.id_user).subscribe(data=>{
      console.log(data)
      let arrid:any[] = []
      data.forEach((item:any) =>{
        if(item.id_user1 === this.id_user && item.status === 1 || item.status === 3){
          arrid.push(item.id_user2)
        }else if(item.id_user2 === this.id_user && item.status === 2 || item.status === 3){
          arrid.push(item.id_user1)
        }
      })
      if(arrid.length>0){
        this.Userservice.getuserbyarrid(arrid).subscribe(data =>{
          this.MeBehaviorSubject.compressionuser(data)
          console.log(data)
        })
      }else if(arrid.length === 0){
        this.alluser =[]
      }
    })
    this.MeBehaviorSubject.alluser$.subscribe(data =>{
      const ok =data.map((item:any) => {
        return({
          _id:item._id,
          username:item.username,
          status:item.status,
          online:item.online,
          id_friend:item.id_friend,
          banchung:item.banchung,
          avatar:item.avatar,
          folower:2
        })
       


    })
    this.alluser = ok
    })
  }

  handlefolow(id_user:any){
    // console.log(id_user);
    const id_user1 = localStorage.getItem('id_user');
    const id_user2 = id_user;
    const status = 1
    if(id_user1){
    const formdata = new FormData()
    formdata.append('id_user1', id_user1);
    formdata.append('id_user2',id_user2);
    formdata.append('status', status.toString())
    this.Folowerservice.addfolower(formdata).subscribe( data =>{ 
      // console.log(data)
      const content = `${this.user.username} đã theo giõi bạn`
      const formnoti = new FormData();
      formnoti.append('id_user',id_user);
      formnoti.append('content',content);
      formnoti.append('type', 'friend');

      this.Notificationservice.addnotification(formnoti).subscribe(data =>{
        this.SocketIoService.sendNotificationfriend(id_user,content)
        this.dangtheogioi()
      })
      
    })
  }

}

}
