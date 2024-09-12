import { Component,OnInit } from '@angular/core';
import { ActiveStateService } from '../../service/active-state.service';
import { Friendservice } from '../../service/friend.service';
import { UserBehaviorSubject } from '../../BehaviorSubject/user.BehaviorSubject';
import { ActivatedRoute } from '@angular/router';
import { FriendBehaviorSubject } from '../../BehaviorSubject/friend.BehaviorSubject';
import { Userservice } from '../../service/userservice';
import { Subscription } from 'rxjs';
import { Folowerservice } from '../../service/folower.service';
import { PostBehaviorSubject } from '../../BehaviorSubject/post.BehaviorSubject';
import { Router } from '@angular/router';
import { Notificationservice } from '../../service/notification.service';
import { SocketIoService } from '../../service/socketio.service';





@Component({
  selector: 'app-profileuser',
  templateUrl: './profileuser.component.html',
  styleUrls: ['./profileuser.component.css']
})
export class ProfileuserComponent implements OnInit{
  allfriend!:any;
  id_user!:any;
  user!:any;
  friendofuser!:any
  postbyuser!:any;
  me!:any
  private subscriptions: Subscription = new Subscription();

  constructor(
    private Notificationservice:Notificationservice,
    private SocketIoService:SocketIoService,
    private router:Router,
    private PostBehaviorSubject:PostBehaviorSubject,
    private Folowerservice:Folowerservice, private Userservice:Userservice, private FriendBehaviorSubject:FriendBehaviorSubject, private activeStateService: ActiveStateService, private friendservice:Friendservice,private UserBehaviorSubject:UserBehaviorSubject,private route: ActivatedRoute) {}


  ngOnInit(): void {
    this.activeStateService.setCurrentPage('');
    const id = localStorage.getItem('id_user')
    // Lắng nghe sự thay đổi của tham số route
    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        this.id_user = params.get('id');
        if(this.id_user === id){
          this.router.navigate([`/profileme`])
        }
        this.Userservice.getuser(id).subscribe(data =>{
          this.me = data
        })
        this.loadUserData();
        this.loadFriendData();
      })
    );

    // Lắng nghe dữ liệu từ BehaviorSubjects
    this.subscriptions.add(
      this.UserBehaviorSubject.alluser$.subscribe(data => {
        this.allfriend = data;
        // console.log(data);
      })
    );

    this.subscriptions.add(
      this.FriendBehaviorSubject.alluser$.subscribe(data => {
        this.user = data[0];
        // console.log(this.user)
        if(this.user.status === 0 || this.user.status === 1 || this.user.status === 2){
          this.getpostbyuser()
        }else if(this.user.status === 3){
          this.getpostbyfriend()
        }
        // console.log(this.user);
      })
    );
  }
  getpostbyuser(){
    // console.log(this.id_user);
    const id:any[] =[]
    id.push(this.id_user);
    console.log(id);
    this.PostBehaviorSubject.setarridfriend([])

    this.PostBehaviorSubject.setarridfolowing(id)
    this.loadpost()
  }
  getpostbyfriend(){
    const id:any[] =[]
    id.push(this.id_user);
    console.log(id);
    this.PostBehaviorSubject.setarridfolowing([])

    this.PostBehaviorSubject.setarridfriend(id);
    this.loadpost()

  }

  loadpost(){
    this.PostBehaviorSubject.listallpost$.subscribe(data =>{
      // console.log(data);
      this.postbyuser = data.reverse()
    })
  }
  loadUserData(): void {
    if (this.id_user) {
      this.Userservice.getuser(this.id_user).subscribe(data => {
        let haha = [];
        haha.push(data);
        this.FriendBehaviorSubject.compressionuser(haha);
      });
    }
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
        const content = `${this.me.username} đã theo giõi bạn`
        const formnoti = new FormData();
        formnoti.append('id_user',id_user);
        formnoti.append('content',content);
        formnoti.append('type', 'friend');

        this.Notificationservice.addnotification(formnoti).subscribe(data =>{
          this.SocketIoService.sendNotificationfriend(id_user,content)
        })
        
      })
    }

  }


  loadFriendData(): void {
    if (this.id_user) {
      this.friendservice.laythongtinfriendbyuser(this.id_user).subscribe(data => {
        // console.log(data);
        this.UserBehaviorSubject.compressionuser(data.slice(0,9));
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  
}
