import { Component,OnInit } from '@angular/core';
import { ActiveStateService } from '../../service/active-state.service';
import { Friendservice } from '../../service/friend.service';
import { UserBehaviorSubject } from '../../BehaviorSubject/user.BehaviorSubject';
import { ActivatedRoute } from '@angular/router';
import { FriendBehaviorSubject } from '../../BehaviorSubject/friend.BehaviorSubject';
import { Userservice } from '../../service/userservice';
import { Subscription } from 'rxjs';






@Component({
  selector: 'app-profileuser',
  templateUrl: './profileuser.component.html',
  styleUrl: './profileuser.component.css'
})
export class ProfileuserComponent implements OnInit{
  allfriend!:any;
  id_user!:any;
  user!:any;
  friendofuser!:any
  private subscriptions: Subscription = new Subscription();

  constructor(private Userservice:Userservice, private FriendBehaviorSubject:FriendBehaviorSubject, private activeStateService: ActiveStateService, private friendservice:Friendservice,private UserBehaviorSubject:UserBehaviorSubject,private route: ActivatedRoute) {}


  ngOnInit(): void {
    this.activeStateService.setCurrentPage('');

    // Lắng nghe sự thay đổi của tham số route
    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        this.id_user = params.get('id');
        this.loadUserData();
        this.loadFriendData();
      })
    );

    // Lắng nghe dữ liệu từ BehaviorSubjects
    this.subscriptions.add(
      this.UserBehaviorSubject.alluser$.subscribe(data => {
        this.allfriend = data;
        console.log(data);
      })
    );

    this.subscriptions.add(
      this.FriendBehaviorSubject.alluser$.subscribe(data => {
        this.user = data[0];
        console.log(this.user);
      })
    );
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

  loadFriendData(): void {
    if (this.id_user) {
      this.friendservice.laythongtinfriendbyuser(this.id_user).subscribe(data => {
        console.log(data);
        this.UserBehaviorSubject.compressionuser(data);
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  
}
