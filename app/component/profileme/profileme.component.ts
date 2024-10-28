import { Component, OnInit } from '@angular/core';
import { Userservice } from '../../service/userservice';
import { Friendservice } from '../../service/friend.service';
import { MeBehaviorSubject } from '../../BehaviorSubject/me.BehaviorSubject';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Postservice } from '../../service/post.service';
import { Storyservice } from '../../service/story.service';
import { finalize } from 'rxjs';


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



constructor(
  private Postservice:Postservice,
  private Storyservice:Storyservice,
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
                // console.log(data);
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

}
