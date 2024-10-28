import { Component, OnInit } from '@angular/core';
import { Userservice } from '../../service/userservice';
import { Friendservice } from '../../service/friend.service';
import { MeBehaviorSubject } from '../../BehaviorSubject/me.BehaviorSubject';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Postservice } from '../../service/post.service';
import { Storyservice } from '../../service/story.service';
import { finalize } from 'rxjs';
import { CmtBehaviorSubject } from '../../BehaviorSubject/cmt.BehaviorSubject';
import { AnimationPlayer } from '@angular/animations';
import { LikeBehaviorSubject } from '../../BehaviorSubject/like.BehaviorSubject';




@Component({
  selector: 'app-profileme',
  templateUrl: './profileme.component.html',
  styleUrl: './profileme.component.css'
})
export class ProfilemeComponent implements OnInit{
  user!:any;
  listfriend!:any;
  selectdFile!:any;
  image:any ='';
  openbinhluan:boolean = false;
  lammo:boolean = false;
  isformaddpost:boolean = false;
  formaddpost!:FormGroup;
  id_user!:any;
  selectedoption!:any;
  postofme!:any;
  friend:any[] =[]
  friends:any[]=[]
  summanyimg:any[] = [];
  storys!:any[]
  post!:any;
  id_user_post!:AnimationPlayer
  allcmt!:any;
  openforminteract:boolean =false;
  id_post!:any;
  loadcomment:boolean =false;
  userpost!:any;
  userlikes!:any;
  userlike!:any;
  currentseen:any ='tatca';

  private initialTransformY = 0; // Biến để lưu vị trí ban đầu




constructor(
  private Postservice:Postservice,
  private Storyservice:Storyservice,
  private CmtBehaviorSubject:CmtBehaviorSubject,
  private userservice:Userservice,
  private LikeBehaviorSubject:LikeBehaviorSubject,
  private MeBehaviorSubject:MeBehaviorSubject, private Userservice:Userservice, private Friendservice:Friendservice, private formbuilder:FormBuilder)
{
  this.formaddpost = this.formbuilder.group({
    content:['',Validators.required],


  })
}

  ngOnInit(): void {
      this.id_user = localStorage.getItem('id_user');
      this.Userservice.getuser(this.id_user).subscribe(data =>{
        this.user = data
        // console.log(data);
      })
      this.Friendservice.laythongtinfriendbyuser(this.id_user).subscribe(data =>{
        this.MeBehaviorSubject.compressionuser(data);
        this.fetchfriend()
      })
      this.Storyservice.getallstorybyuser(this.id_user)
      .pipe(
        finalize(() =>{
        
        })
      )
      .subscribe(data =>{
        console.log(data);
        
        if(data.length>0){
          this.storys = data.reverse()

        }
      })
      this.getpost()
    

  }
  getpost() {
    this.Postservice.getpostbyme(this.id_user).subscribe({
        next: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                console.log(data);
                this.postofme = data.reverse();
                this.summanyimg = this.postofme.slice(0, 9);
            } else {
                this.summanyimg = []; // Đảm bảo summanyimg là mảng rỗng nếu không có dữ liệu
            }
        },
        error: (error) => {
            console.error('Error fetching posts:', error);
            this.summanyimg = []; // Đảm bảo summanyimg là mảng rỗng nếu có lỗi
        },
        complete: () => {
            // Có thể xử lý khi hoàn thành nếu cần
        }
    });
}
  onFileChange(event:any){
    const file = event.target.files[0]
    if(file){
      this.selectdFile = file;
      const render =  new FileReader()
      render.onload =(e:any)=>{
        this.image = e.target.result
        // console.log(this.image);

      }
      render.readAsDataURL(file)
    }
  }
  handleaddpost(){
    let image =''
    const content = this.formaddpost.get('content')?.value;
    // console.log(content);
    // console.log(this.id_user);
    if(this.selectdFile){
    image = this.selectdFile

    }
    if(this.selectedoption === undefined){
      this.selectedoption = 1
    }
    // console.log(this.selectedoption);

    const formdata = new FormData()
    formdata.append('content', this.formaddpost.get('content')?.value);
    formdata.append('id_user' ,this.id_user);
    formdata.append('file', image);
    formdata.append('status', this.selectedoption)
    
    this.Postservice.addpost(formdata).subscribe(data =>{
      if(data === true){
        this.formaddpost.reset();
        this.selectedoption ='';
        this.isformaddpost = false;
        this.lammo = false;
        this.getpost();
      }
    })
    const ids = {id:this.id_user}
    this.Friendservice.updatelastPostTimeUser(ids).subscribe(data =>{
      // console.log(data);
    })

  }

  selectedOption(event:any){
    const option = event.target as HTMLSelectElement;
    // console.log(option.value);
    this.selectedoption = option.value;
  }
  openformpost(){
    this.isformaddpost = true;
    this.lammo = true
  }
  closeformpost(){
    this.isformaddpost = false;
    this.lammo = false;
  }


  

  fetchfriend(){
    this.MeBehaviorSubject.alluser$.subscribe(data =>{
      this.listfriend = data;
      this.friend = data.slice(0,9)
      this.friends = data.slice(0,5)
      // console.log(data)
    })
  }
  mobinhluan(id: any) {
    // alert(id)
    this.loadcomment = true;
    
    // Gọi hàm lấy comment theo bài viết
    this.CmtBehaviorSubject.getcmtbypost(id);
    
    this.CmtBehaviorSubject.post$
    .subscribe(data => {
      console.log(data);
      
        this.post = data;
        // Đặt lại loadcomment là false sau 1 giây
        setTimeout(() => {
            this.loadcomment = false;
        }, 500);
    });

    this.id_user_post = this.id_user;
    this.id_post = id;
    this.openbinhluan = true;

    this.CmtBehaviorSubject.allcmt$
    .subscribe(data => {
        this.allcmt = data;
        // Đặt lại loadcomment là false sau 1 giây
        setTimeout(() => {
            this.loadcomment = false;
        }, 500);
    });

    // console.log(this.loadcomment);
}
closebinhluan(){
  this.openbinhluan = false
}


openinteract(id:any,id_user:any){
  console.log(id)
  console.log(id_user);
  
  this.Postservice.getpostbyid(id).subscribe(data =>{
    this.post=data
  })
  this.userservice.getuser(id_user).subscribe(data =>{
    this.userpost = data
  })
  this.LikeBehaviorSubject.setidpost(id)
  this.loadlike()
}
loadlike(){
  this.LikeBehaviorSubject.like$.subscribe(data =>{
    // console.log(data)
    this.userlikes = data
    this.userlike = this.userlikes
   

    this.openforminteract=true
  })
}
dong(){
  this.openforminteract = false
}
tatca(){
  this.userlike = this.userlikes
  this.currentseen = 'tatca'
}
seenlike(){
  this.userlike = this.userlikes.filter((item:any) => item.type === 1)
  this.currentseen = 'like'
}
seenfavorite(){
  this.userlike = this.userlikes.filter((item:any) => item.type === 2)
  this.currentseen = 'favorite'
}
seenhaha(){
  this.userlike = this.userlikes.filter((item:any) => item.type === 3)
  this.currentseen = 'haha'
}
seensaid(){
  this.userlike = this.userlikes.filter((item:any) => item.type === 4)
  this.currentseen = 'said'
}
seenangry(){
  this.userlike = this.userlikes.filter((item:any) => item.type === 5)
  this.currentseen = 'angry'
}
seenwow(){
  this.userlike = this.userlikes.filter((item:any) => item.type === 6)
  this.currentseen = 'wow'
}
}
