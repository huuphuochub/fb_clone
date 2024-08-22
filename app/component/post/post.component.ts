import { Component,OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Postservice } from '../../service/post.service';
import { Userservice } from '../../service/userservice';
import { ActiveStateService } from '../../service/active-state.service';
import { Commentservice } from '../../service/comment.service';




@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit{
  id_post!:any;
  id_user!:any;
  user!:any
  post!:any
  usercmt!:any;
  arrcmt!:any;
  allcmts!:any
  constructor(private router:Router,private route:ActivatedRoute,
    private activeStateService:ActiveStateService,
    private Postservice:Postservice,
    private Userservice:Userservice,
    private Commentservice:Commentservice,
  ){

  }

  ngOnInit(): void {
    this.activeStateService.setCurrentPage('');

    this.id_post = this.route.snapshot.paramMap.get('id');
    console.log(this.id_post); 
    this.Postservice.getpostformidpost(this.id_post).subscribe(data =>{
      console.log(data);
      this.post = data
      this.id_user = data.id_user
      this.Userservice.getuser(this.id_user).subscribe(data=>{
        console.log(data)
        this.user=data
      })
    })
    this.Commentservice.getcommentbypost(this.id_post).subscribe(data =>{
      console.log(data);
      this.arrcmt = data
      const arrid =data.map((item:any) =>item.id_user)
      this.Userservice.getuserbyarrid(arrid).subscribe(datas =>{
        console.log(datas);
        this.usercmt = datas
        this.loadusercmt()

      })
    })

  }
  loadusercmt(){
    const cmt =this.arrcmt.map((cmt:any)=>{
      const user = this.usercmt.find((user:any) => cmt.id_user === user._id)
      return {
        id_user:cmt.id_user,
        avatar:user.avatar,
        username:user.username,
        date:cmt.date.split("T")[1],
        content:cmt.content,
        image:cmt.image
      }
    })
    this.allcmts = cmt 
    console.log(cmt)
  }
}
