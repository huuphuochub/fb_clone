import { Component,OnInit } from '@angular/core';
import { ActiveStateService } from '../../service/active-state.service';
import { Sharedataservice } from '../../service/sharedata.service';
import { Friendservice } from '../../service/friend.service';
import { Messengerservice } from '../../service/messenger.service';
import { UserBehaviorSubject } from '../../BehaviorSubject/user.BehaviorSubject';
import { SocketIoService } from '../../service/socketio.service';
import { FriendBehaviorSubject } from '../../BehaviorSubject/friend.BehaviorSubject';
import { Userservice } from '../../service/userservice';
import { Notificationservice } from '../../service/notification.service';



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit{

  searchuser:boolean =true
  hienbaiviet:boolean=false;
  alluser!:any;
  id_user!:any;
  listuserhoanchinh!:any;
  loading:boolean = false;
  user!:any;
  users!:any;
  


  constructor(
    private Notificationservice:Notificationservice,
    private socketservice:SocketIoService,
    private Userservice:Userservice,
    private FriendBehaviorSubject:FriendBehaviorSubject,
    private UserBehaviorSubject:UserBehaviorSubject,
    private activeStateService:ActiveStateService, private sharedataservice:Sharedataservice,private friendservice:Friendservice, private messengerservice:Messengerservice){}
ngOnInit(): void {
  // this.socketservice.sendOnlineStatus(this.id_user);
  this.loading = true;
  this.id_user = localStorage.getItem('id_user')
  this.activeStateService.setCurrentPage('');
  this.fetchalldataa();
  this.Userservice.getuser(this.id_user).subscribe(data =>{
    this.user = data
  })
  
}

fetchalldataa(){
  this.sharedataservice.usersearch$.subscribe(data=>{
    this.alluser = data;
    // console.log(data)
    this.fetchtatcaloimoi()
  })

}

fetachdata(){
  this.UserBehaviorSubject.alluser$.subscribe(data =>{
    console.log(data);
    
    if(!data || data.length ===0){
      this.loading=true
      // this.fetchtatcaloimoi()
    }else{
      this.listuserhoanchinh = data;
      console.log(data);
      this.loading = false
    }
   
  })
}
fetchtatcaloimoi(){
 
 
  this.UserBehaviorSubject.compressionuser(this.alluser)
  this.fetachdata()
}


searchusers(){
  this.searchuser = true;
  this.hienbaiviet=false

}
searchpost(){
  this.searchuser = false;
  this.hienbaiviet =true;

}
addfriend(id:any){
  // console.log(id)
 const formdata = new FormData()
 formdata.append('id_user1',this.id_user);
 formdata.append('id_user2', id);
//  this.fetchalldataa();

 this.friendservice.addfriend(formdata).subscribe(data=>{
  if(data === true){

    this.fetchalldataa()
    const content =  `${this.user.username} đã gửi cho bạn lời mời kết bạn`
    const formnoti = new FormData()
    formnoti.append('id_user',id);
    formnoti.append('content', content);
    formnoti.append('type', 'friend')
    this.Notificationservice.addnotification(formnoti).subscribe(data=>{
      this.socketservice.sendNotificationfriend(id,content)
    })
    
  }
 })
 


}

huyloimoi(id:any){
    this.friendservice.huyloimoi(id).subscribe(data =>{
      if(data == true){
        this.fetchalldataa();
      }
    })
}

acpfriend(id:any,id_users:any){
  // console.log(id)
  this.Userservice.getuser(id_users).subscribe(data =>{
    this.users = data
    // console.log(data);
    this.handleacp(id,id_users)
  })
  


}

handleacp(id:any,id_users:any){
  let formdata = new FormData()
  formdata.append('id_friend',id);
  this.friendservice.acpfriend(formdata).subscribe(data=>{
    if(data == true){
      this.fetchalldataa();
    }
  })
  if(this.users){
    const formdata = new FormData()
    const content = `${this.user.username} đã chấp nhân lời mời kết bạn`
    formdata.append('id_user',id_users);
    formdata.append('content', content);
    formdata.append('type', 'friend');
    this.Notificationservice.addnotification(formdata).subscribe(data=>{
      this.socketservice.sendNotificationfriend(id_users,content)
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
    this.messengerservice.addromchat(dataroom).subscribe(data =>{
      // console.log(data)
    })
  }
}


}
