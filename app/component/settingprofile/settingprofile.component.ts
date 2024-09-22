import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Userservice } from '../../service/userservice';
import { catchError, finalize } from 'rxjs';
import { Router } from '@angular/router';
import { EncryptionService } from '../../service/EncryptionService';



@Component({
  selector: 'app-settingprofile',
  templateUrl: './settingprofile.component.html',
  styleUrl: './settingprofile.component.css'
})
export class SettingprofileComponent implements OnInit{
  selectedFile!:any;
  email!:any;
  formname!:FormGroup;
  loiname:boolean = false 
  avatarUrl: string = 'https://i.pinimg.com/originals/9a/63/e1/9a63e148aaff53532b045f6d1f09d762.webp';
isloading:boolean = false
// errorMessage: string | null = null; // Biến để lưu trữ thông báo lỗi

constructor(private userservice:Userservice, private formbuilder:FormBuilder, private router:Router, private EncryptionService:EncryptionService){
  this.formname = this.formbuilder.group({
    username:['',Validators.required]
  })
}
ngOnInit(): void {
  const email = this.EncryptionService.getemail();
  console.log(email);
  this.email = email
}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarUrl = e.target.result;
      };
      reader.readAsDataURL(file);

    }
  }

  handlesetting():void{
    const username = this.formname.get('username')?.value;
    this.isloading =true
    console.log(username, this.email)
    if(!this.selectedFile){
      this.selectedFile = 'https://i.pinimg.com/originals/9a/63/e1/9a63e148aaff53532b045f6d1f09d762.webp';
    }else if(!username){
      this.loiname = true
    }
      const formdata = new FormData()
      formdata.append('email',this.email);
      formdata.append('username',this.formname.get('username')?.value);
      formdata.append('file', this.selectedFile);
      this.userservice.setprofile(formdata)
      .pipe(
        catchError((error:any) =>{
          console.error('Error updating profile:', error); 
          return '';
        }),
        finalize(() =>{
          this.isloading = false
        })
      )
      .subscribe(data =>{
        if(data){
          localStorage.setItem('id_user', data._id);
          console.log(data);
          // localStorage.setItem('')
          this.router.navigate(['/'])

        }
      })
    
  }

}




