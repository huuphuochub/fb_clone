import { Component, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Userservice } from '../../service/userservice';
import { Router } from '@angular/router';
import { environment } from '../../environment';
import { EncryptionService } from '../../service/EncryptionService';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private key = environment.secretKey;
  formlogin!:FormGroup;
  constructor(private formbuilder:FormBuilder,private userservice:Userservice, private router:Router, private  EncryptionService:EncryptionService){
    this.formlogin = this.formbuilder.group({
      email:['',Validators.required],
      password:['',Validators.required]

    })
  }
  public erremail:boolean =false;
  public errmatkhau:boolean =false;
  loi!:any;


  // @ViewChild('inputField') inputField!: ElementRef<HTMLInputElement>;
  @ViewChild('inputField2') inputField2!: ElementRef<HTMLInputElement>;

 
handlelogin(){
  console.log(this.formlogin.get('email')?.value);
  
  const formdata = new FormData()
  formdata.append('email',this.formlogin.get('email')?.value);
  formdata.append('password',this.formlogin.get('password')?.value);
  // console.log(formdata);
  
  // console.log('ok')
  this.userservice.login(formdata).subscribe(data =>{
    // alert(data.thongbao)
    // console.log(data);
    if(data.thongbao == false){
      this.loi = data.loi
    }else if(data.thongbao == true){
      localStorage.setItem('id_user',data.id_user)
      this.EncryptionService.saveemail(data.email);
      this.router.navigate(['/'])
    }
  })
}
  onInputs(): void {
    // const value = this.inputField.nativeElement.value;
    const values = this.inputField2.nativeElement.value;
    // console.log(values.trim().length)
     if
    (values.trim().length<8 && values.trim() !== ''){
      this.errmatkhau = true;
    }else{
      this.errmatkhau = false
    }
    
  }
  onTestLoginChange(event: any) {
    if (event.target.checked) {
      // Khi checkbox được chọn, điền sẵn giá trị email và password
      this.formlogin.patchValue({
        email: 'user1@gmail.com',
        password: '11111111'
      });
    } else {
      // Nếu bỏ chọn, làm trống các trường
      this.formlogin.patchValue({
        email: '',
        password: ''
      });
    }
  }

} 
