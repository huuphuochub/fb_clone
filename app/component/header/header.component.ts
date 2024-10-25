import { Component, ElementRef, ViewChild ,HostListener} from '@angular/core';
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
import { Notificationservice } from '../../service/notification.service';
import { MeBehaviorSubject } from '../../BehaviorSubject/me.BehaviorSubject';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  private lastWidth: number = window.innerWidth;
  isChecked:boolean[] =[]; 
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
notification!:any
newnoti!:any;
arridingroup:any[] =[];
showaddgroup:boolean = false;
formnamegroup!:FormGroup;
profileme!:any;
opensearch:boolean = false;

@HostListener('window:resize', ['$event'])
onResize(event: Event) {
  const currentWidth = window.innerWidth;
  
  // Kiểm tra nếu chiều rộng thay đổi vượt quá ngưỡng
  if(currentWidth >1100){
    this.opensearch = false
  }
}

@ViewChild('scrollBottom') private scrollBottom!: ElementRef;


  constructor(private activeStateService: ActiveStateService, 
    private Messengerservice:Messengerservice,
    private Notificationservice:Notificationservice,
    private friendservice:Friendservice,
    private UserBehaviorSubject:UserBehaviorSubject,
    private EncryptionService:EncryptionService,
    private FriendBehaviorSubject:FriendBehaviorSubject,
    private socketioservice:SocketIoService,
    private userservice:Userservice,
    
    private sharedataservice:Sharedataservice,
    private formbuilder:FormBuilder,
    private router:Router,
    private MeBehaviorSubject:MeBehaviorSubject
    
  ) {
    this.formsearchuser = this.formbuilder.group({
      username:['',Validators.required]
    })
    this.forminputchat = this.formbuilder.group({
      content:['',Validators.required]
    })
    this.formnamegroup = this.formbuilder.group({
      name:['',Validators.required]
    })

  }
  ngOnInit(): void {
    this.activeStateService.currentPage$.subscribe(page => {
      this.currentPage = page;
    });

    const id_user = localStorage.getItem('id_user');
    // alert(id_user)
    if(!id_user){
      this.router.navigate(['/login']);

    }
  
    this.id_user = id_user
    const email = this.EncryptionService.getemail()
    this.userservice.getuser(id_user).subscribe(data=>{
      // alert(data)
      // console.log(data);
      this.profileme = data
      if(data === null){
        this.router.navigate(['/login']);
      }else{
        this.test()
      }
    })
   this.loadroom()
   this.loadnoti()
  
    this.socketioservice.sendOnlineStatus(id_user);
    this.socketioservice.getNotifications().subscribe(data =>{
      // console.log(data);
      this.loadnoti()
    })
    this.socketioservice.getNotificationsfriend().subscribe(data =>{
      this.loadnoti()
    })

  }

  toggleCheckbox(index:number) {
    this.isChecked[index] = !this.isChecked[index]; 


    if(this.arridingroup.indexOf(this.mess[index].id_user) === -1){
      this.arridingroup.push(this.mess[index].id_user);
    }else{
      this.arridingroup = this.arridingroup.filter((item:any) =>item !== this.mess[index].id_user);
    }
    
    console.log(this.arridingroup);
    

    
}
  OpenClickSearch(){
    this.opensearch = true;
  }
  CloseClickSearch(){
    this.opensearch = false;
  }
  dangxuat(){
    localStorage.clear();
    this.router.navigate(['/login']);

  }

  loadnoti(){
    this.Notificationservice.getnotibyuser(this.id_user).subscribe(data =>{
      this.notification = data
      // console.log(data)
     this.newnoti = data.filter((data:any) => data.status ===0);
    })
  }
  updatenoti(id:any){
    // console.log(id);
    const ok = this.notification.filter((item:any) =>item._id === id)
    // console.log(ok)
    const id_post = ok[0].id_post
    this.showthongbao = false;
    this.Notificationservice.updatenoti(id).subscribe(data =>{
      // console.log(id_post)
     if(id_post){
      this.router.navigate([`post/${id_post}`])
      this.loadnoti()
 
     }else{
      // console.log(`${ok[0].type}/${id_post}`)
      this.router.navigate([`${ok[0].type}/`])
      this.loadnoti()

     }

    })

  }
  loadroom(){
    this.Messengerservice.getallroombyuser(this.id_user).subscribe(data =>{
      // console.log(data);
      this.allmessenger = data;
      this.showaddgroup = false;
      this.compressionuserroom();

      // this.compressionuserroom()
    })
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


    
    if(this.forminputchat.get('content')?.value ==='' || this.forminputchat.get('content')?.value ===null){
      if(!this.selectedFile){
          return;
      }
    }
    if(this.forminputchat.get('content')?.value === null){
     const content = ''
     formdata.append('content', content);

    }else{
      formdata.append('content', this.forminputchat.get('content')?.value)

    }
  formdata.append('username', this.profileme.username)
  formdata.append('avatar', this.profileme.avatar)
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
      this.loadroom();
      if(id_user){
        this.socketioservice.sendmess(id_user,id_room);
        
        }
    }
  })
  // console.log(id_user);
}

addgroup(){
  this.Messengerservice.getallroombyuser(this.id_user).subscribe(data =>{
    // console.log(data);
    this.allmessenger = data;
    this.compressionuserroom();
    this.showaddgroup = true


    // this.compressionuserroom()
  })
  // this.loadroom()
}
closeaddgroup(){
  this.showaddgroup = false
  this.selectedFile = ''
  this.image =''
  // this.loadroom()
}


handleaddgroup(){
  // console.log(this.formnamegroup.get('name')?.value);
  this.arridingroup.push(this.id_user)
  // console.log(JSON.stringify(this.arridingroup));
  // console.log(this.selectedFile)

  const formdata = new FormData()
  this.arridingroup.forEach((id) => {
    formdata.append('id_user[]', id);
});
  formdata.append('type', '2');
  formdata.append('name', this.formnamegroup.get('name')?.value);
  formdata.append('lastmess', 'bạn có nhóm mới');
  formdata.append('file', this.selectedFile ? this.selectedFile : '');
  this.Messengerservice.addgroupchat(formdata).subscribe(data =>{
    // console.log(data);
    if(data === true){
      this.selectedFile='';
      this.image = '';
    }
    
  })



  // formdata.append('id_user', this.arridingroup)
}


  test(){
    this.friendservice.laythongtinfriendbyuser(this.id_user).subscribe(data=>{
      this.profilefriend = data
      this.friendonline()
      

    })
    this.socketioservice.getallfriendonline().subscribe(data =>{
      this.idfriendonline= data;
      this.UserBehaviorSubject.setidlistfriend(this.idfriendonline)
      this.MeBehaviorSubject.setidlistfriend(this.idfriendonline)

      this.FriendBehaviorSubject.setidlistfriend(this.idfriendonline)

      this.friendonline();
    })
    this.socketioservice.getfriendonline().subscribe((data) =>{
      if (!this.idfriendonline.includes(data)) {
        this.idfriendonline.push(data);
        this.UserBehaviorSubject.setidlistfriend(this.idfriendonline)
        this.FriendBehaviorSubject.setidlistfriend(this.idfriendonline)
        this.MeBehaviorSubject.setidlistfriend(this.idfriendonline)


    }
    this.friendonline(); 
    })
    this.socketioservice.getfriendoffline().subscribe((data=>{
      this.idfriendonline = this.idfriendonline.filter((item:any)=>item !== data);
      this.UserBehaviorSubject.setidlistfriend(this.idfriendonline);
      this.FriendBehaviorSubject.setidlistfriend(this.idfriendonline)
      this.MeBehaviorSubject.setidlistfriend(this.idfriendonline)


      this.friendonline()
    }))
    this.socketioservice.receicemess().subscribe(data =>{
      // console.log(data);
      this.loadroom()
        this.openchat(data);
      
    })
  
  }

  friendonline(){
this.MeBehaviorSubject.alluser$.subscribe(data =>{
  this.alluser = data
  // console.log(data);
  this.compressionuserroom();
})
  }
xemnhomchat(){
  this.Messengerservice.getgroupchatbyuser(this.id_user).subscribe(data =>{
    this.allmessenger = data;
    this.showaddgroup = false
    this.compressionuserroom()
  })
}


  compressionuserroom(){
    let arr :any[] =[]
    // console.log(this.alluser);
    // console.log(this.allmessenger)
    this.allmessenger.forEach((mess:any) =>{
      if(Array.isArray(this.alluser)){
        this.alluser.forEach((friend:any) =>{
          if(mess.id_user.includes(friend._id)){
            arr.push({
              id_room:mess._id,
              id_user:friend._id,
              name:mess.name ? mess.name : friend.username,
              avatar:mess.image ? mess.image : friend.avatar,
              online:friend.online,
              lastmess:mess.lastmess,
              lastuser:mess.lastuser,
              type:mess.type,

            })
          }
        })
      }
    })
    // console.log(arr);
    const uniqueRooms = arr.filter((room, index, self) =>
      index === self.findIndex((r) => (
          r.id_room === room.id_room
      ))
  );
    this.mess = uniqueRooms
  }


  oncheckeduser(event:any,ids:any){
    if (event.target.checked) {
      // console.log(ids);
      
      // Nếu checkbox được chọn, thêm id_user vào mảng
      this.arridingroup.push(ids);
    } else {
      // Nếu checkbox bị bỏ chọn, loại bỏ id_user khỏi mảng
      this.arridingroup = this.arridingroup.filter((id:any) => id !== ids);
    }
    // console.log(this.arridingroup);
  }
  

  timkiemuser(){

    const key  = this.formsearchuser.get('username')?.value;
    this.sharedataservice.timkiemban(key)
    this.router.navigate(['/search'])

  }

    openchat(id:any){
      const currentWidth = window.innerWidth;

      console.log(currentWidth);
      if(currentWidth <620){
        this.showchat = false;
      }
      
      // console
      this.idroom = id;
      const haha = this.mess.filter((item:any) => item.id_room == id)
      this.userchat = haha;
      // console.log(haha);
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
              sendstatus: dataItem.sendstatus,
              avatar:dataItem.avatar ? dataItem.avatar : '',
              username:dataItem.username ? dataItem.username : '',
            }));
      
          // Trả về đối tượng với nội dung mới được gộp
          return {
            id_user:item.id_user,
            id_room: item.id_room,
            name: item.name,
            avatar: item.avatar,
            online: item.online,
            content: content,
            type:item.type,
          };
        });
      

        // console.log(ok);
        this.contentmess = ok
        // console.log(this.contentmess);



      })
      // console.log(this.contentmess);
      this.showformchat = true;
      console.log(this.showformchat);
      
   
      
    }

    scrollToBottom(): void {
      if(this.scrollBottom){
      this.scrollBottom.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
    deleteimg(){
      this.image = '';

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
