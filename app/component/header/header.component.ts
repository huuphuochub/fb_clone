import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActiveStateService } from '../../service/active-state.service';
import { SocketIoService } from '../../service/socketio.service';
import { Userservice } from '../../service/userservice';
import { Sharedataservice } from '../../service/sharedata.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EncryptionService } from '../../service/EncryptionService';
import { Friendservice } from '../../service/friend.service';
import { FriendBehaviorSubject } from '../../BehaviorSubject/friend.BehaviorSubject';
import { UserBehaviorSubject } from '../../BehaviorSubject/user.BehaviorSubject';
import { Messengerservice } from '../../service/messenger.service';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  showchat:boolean =false;
  showthongbao:boolean =false;
showcaidat:boolean = false;
showformchat:boolean=false;
  currentPage: string = '';
formsearchuser!:FormGroup;
id_user!:any;
idfriendonline!:any;
isfriendonline:any[] =[];
profilefriend!:any;
allmessenger!:any;


  constructor(private activeStateService: ActiveStateService, 
    private Messengerservice:Messengerservice,
    private friendservice:Friendservice,
    private UserBehaviorSubject:UserBehaviorSubject,
    private EncryptionService:EncryptionService,
    // private FriendBehaviorSubject:FriendBehaviorSubject,
    private socketioservice:SocketIoService,
    private userservice:Userservice,
    
    private sharedataservice:Sharedataservice,
    private formbuilder:FormBuilder,
    private router:Router
  ) {
    this.formsearchuser = this.formbuilder.group({
      username:['',Validators.required]
    })

  }
  ngOnInit(): void {
    this.activeStateService.currentPage$.subscribe(page => {
      this.currentPage = page;
    });
    const id_user = localStorage.getItem('id_user');
    this.id_user = id_user
    const email = this.EncryptionService.getemail()
    this.userservice.getuser(id_user).subscribe(data=>{
      if(data === false){
        this.router.navigate(['/login']);
      }else{
        this.test()
      }
    })
    this.Messengerservice.getallroombyuser(this.id_user).subscribe(data =>{
      console.log(data);
      this.allmessenger = data;

    })
  
    this.socketioservice.sendOnlineStatus(id_user);

  }

  test(){
    this.friendservice.laythongtinfriendbyuser(this.id_user).subscribe(data=>{
      this.profilefriend = data
      this.friendonline()
      

    })
    this.socketioservice.getallfriendonline().subscribe(data =>{
      this.idfriendonline= data;
      this.UserBehaviorSubject.setidlistfriend(this.idfriendonline)
      this.friendonline();
    })
    this.socketioservice.getfriendonline().subscribe((data) =>{
      if (!this.idfriendonline.includes(data)) {
        this.idfriendonline.push(data);
        this.UserBehaviorSubject.setidlistfriend(this.idfriendonline)
    }
    this.friendonline(); 
    })
    this.socketioservice.getfriendoffline().subscribe((data=>{
      this.idfriendonline = this.idfriendonline.filter((item:any)=>item !== data);
      this.UserBehaviorSubject.setidlistfriend(this.idfriendonline);
      this.friendonline()
    }))
  
  }

  friendonline(){



this.UserBehaviorSubject.alluser$.subscribe(data =>{
  console.log(data);
})
  }





  timkiemuser(){

    const key  = this.formsearchuser.get('username')?.value;
    this.sharedataservice.timkiemban(key)
    this.router.navigate(['/search'])

  }


  close(){
    if(this.showchat === true){

      this.showchat = false;


    }else if(this.showchat ===false){
        this.showthongbao=false
      this.showcaidat=false
    this.showchat = true;
   

    }
  }
  closetb(){
    if(this.showthongbao === true){

      this.showthongbao = false;


    }else if(this.showthongbao ===false){
        this.showchat=false
        this.showcaidat=false
      
    this.showthongbao = true;

    }
  }
  closecaidat(){
    if(this.showcaidat === true){

      this.showcaidat = false;


    }else if(this.showcaidat ===false){
     this.showchat=false;
     this.showthongbao=false
    this.showcaidat = true;
 
    }
  }
  closekhungchat(){
    this.showformchat = false;
  }
}
