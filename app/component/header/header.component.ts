import { Component, ElementRef, ViewChild } from '@angular/core';
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
selectedFile!:any;
idfriendonline!:any;
isfriendonline:any[] =[];
profilefriend!:any;
allmessenger!:any;
alluser!:any
mess!:any
contentmess!:any;
forminputchat!:FormGroup
image:any ='';
userchat!:any;
elementScrolled:boolean=false
idroom!:any;
@ViewChild('scrollBottom') private scrollBottom!: ElementRef;


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
    private router:Router,
    
  ) {
    this.formsearchuser = this.formbuilder.group({
      username:['',Validators.required]
    })
    this.forminputchat = this.formbuilder.group({
      content:['',Validators.required]
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
      // console.log(data);
      this.allmessenger = data;
      // this.compressionuserroom()
    })
  
    this.socketioservice.sendOnlineStatus(id_user);

  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.image = e.target.result;
      };
      reader.readAsDataURL(file);

    }
  }

sendchat(id_user:any){
  const formdata = new FormData();
  
  formdata.append('content', this.forminputchat.get('content')?.value)
  // console.log(this.userchat);
  let id_room = ''
  this.userchat.forEach((item:any)=>{
    id_room = item.id_room
  })
  formdata.append('id_room', id_room);
  formdata.append('id_user', this.id_user);
  if(!this.selectedFile){
    this.selectedFile =''
  }
  formdata.append('file', this.selectedFile);

  this.Messengerservice.sendchat(formdata).subscribe(data=>{
    if(data ===true){
      this.openchat(this.idroom)
      this.forminputchat.reset();
      this.selectedFile = null
      this.image = '';
      if(id_user){
        this.socketioservice.sendmess(id_user,id_room);
        
        }
    }
  })
  console.log(id_user);

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
    this.socketioservice.receicemess().subscribe(data =>{
      console.log(data);
      this.friendonline()
        this.openchat(data);
      
    })
  
  }

  friendonline(){
this.UserBehaviorSubject.alluser$.subscribe(data =>{
  this.alluser = data
  // console.log(data);
  this.compressionuserroom();
})
  }



  compressionuserroom(){
    let arr :any[] =[]
    // console.log(this.alluser);
    // console.log(this.allmessenger)
    this.allmessenger.forEach((mess:any) =>{
        this.alluser.forEach((friend:any) =>{
          if(mess.id_user.includes(friend._id)){
            arr.push({
              id_room:mess._id,
              id_user:friend._id,
              name:friend.username,
              avatar:friend.avatar,
              online:friend.online,
              lastmess:mess.lastmess,
              lastuser:mess.lastuser

            })
          }
        })
    })
    // console.log(arr);
    this.mess = arr
  }


  timkiemuser(){

    const key  = this.formsearchuser.get('username')?.value;
    this.sharedataservice.timkiemban(key)
    this.router.navigate(['/search'])

  }

    openchat(id:any){
      // console.log(id)
      let arr:any[] =[]
      // console
      this.idroom = id;
      const haha = this.mess.filter((item:any) => item.id_room == id)
      this.userchat = haha;
      console.log(haha);
      this.Messengerservice.fetchchatbyroom(id).subscribe(abc => {
        const data = abc.reverse()
        const ok = haha.map((item: any) => {
          // Tìm những tin nhắn phù hợp với id_room hiện tại
          const content = data
            .filter((dataItem: any) => dataItem.id_room === item.id_room) // Lọc chỉ những tin nhắn có id_room khớp
            .map((dataItem: any) => ({
              id_user: dataItem.id_user,
              content: dataItem.content,
              image: dataItem.image ? dataItem.image : '',
              status: dataItem.status,
              sendstatus: dataItem.sendstatus
            }));
      
          // Trả về đối tượng với nội dung mới được gộp
          return {
            id_user:item.id_user,
            id_room: item.id_room,
            name: item.name,
            avatar: item.avatar,
            online: item.online,
            content: content
          };
        });
      

        console.log(ok);
        this.contentmess = ok
        console.log(this.contentmess);



      })
      // console.log(this.contentmess);
      this.showformchat = true;
   
      
    }

    scrollToBottom(): void {
      if(this.scrollBottom){
      this.scrollBottom.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
    ngAfterViewChecked() {
      this.scrollToBottom();
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
