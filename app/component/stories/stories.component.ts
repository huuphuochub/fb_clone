import { Component,OnInit } from '@angular/core';
import { Sharedataservice } from '../../service/sharedata.service';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrl: './stories.component.css'
})
export class StoriesComponent implements OnInit{
  id_story!:any
  storys!:any
  userstory!:any;
  isviewer:boolean=false;
  idme!:any
  constructor(private Sharedataservice:Sharedataservice,
    private router:Router,private route:ActivatedRoute,
  ){}


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id_story  = params.get('id');
      this.loadstory()
    })
    this.idme = localStorage.getItem('id_user');



   
  }
  loadstory(){
    this.Sharedataservice.story$.subscribe(data =>{
      // console.log(data)
      this.storys = data
      
    })
    const ok =this.storys.filter((item:any) =>item._id === this.id_story)
    // console.log(ok)
    this.userstory = ok[0]
    if(this.userstory.id_user !== this.idme){
      this.isviewer === false
    }else if(this.userstory.id_user === this.idme){
      this.isviewer === true
    }
  }
}
