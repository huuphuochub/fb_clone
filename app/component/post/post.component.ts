import { Component,OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Postservice } from '../../service/post.service';
import { Userservice } from '../../service/userservice';
import { ActiveStateService } from '../../service/active-state.service';




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
  constructor(private router:Router,private route:ActivatedRoute,
    private activeStateService:ActiveStateService,
    private Postservice:Postservice,
    private Userservice:Userservice,
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
        // console.log(data)
        this.user=data
      })
    })

  }
}
