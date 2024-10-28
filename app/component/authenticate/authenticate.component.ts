import { Component, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Userservice } from '../../service/userservice';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sharedataservice } from '../../service/sharedata.service';
import { EncryptionService } from '../../service/EncryptionService';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrl: './authenticate.component.css'
})
export class AuthenticateComponent implements OnInit{
  public isinput0:boolean =false;
  public isinput1:boolean =false
  public isinput2:boolean =false
  public isinput3:boolean =false;
  public isinput4:boolean =false
  public isinput5:boolean =false;
  public valuein1!:any
  public valuein2!:any
  public valuein3!:any
  public valuein4!:any
  public valuein5!:any
  public valuein6!:any
  formlogin!:FormGroup;
  formpassword!:FormGroup;
  saimaotp:boolean= false
  thoigianconlai!:any;
  times!:any
  email!:any;
  
  hienformpassword:boolean = false
  loipassword:boolean= false;
  loicfpassword:boolean=false;
      constructor(private EncryptionService:EncryptionService,private formBuilder: FormBuilder, private userservice:Userservice, private router:Router, private sharedataservice:Sharedataservice){
  this.formlogin = this.formBuilder.group({
    name:['', Validators.required],
  password:['', Validators.required]
  })
  this.formpassword = this.formBuilder.group({
    password:['',Validators.required],
    cfpassword:['', Validators.required],
  })
  
}

ngOnInit(): void {
  this.demthoigian()
  this.sharedataservice.email$.subscribe(data =>{
    this.email = data
    console.log(data);
    if(data = ''){
      alert('có lỗi, vui lòng quay lại nhập email');
      this.router.navigate(['/regsiter'])

    }
    // console.log(data);
  })
}

  @ViewChild('inputField') inputField!: ElementRef<HTMLInputElement>;
  @ViewChild('isnputField1') isnputField1!: ElementRef<HTMLInputElement>;
  @ViewChild('insputField2') insputField2!: ElementRef<HTMLInputElement>;
  @ViewChild('inpsutField3') inpsutField3!: ElementRef<HTMLInputElement>;
  @ViewChild('insputField4') insputField4!: ElementRef<HTMLInputElement>;
  @ViewChild('inpsutField5') inpsutField5!: ElementRef<HTMLInputElement>;



  onInput(): void {
    this.valuein1=this.inputField.nativeElement.value;
    this.chuyensanginput1()

    
  }
  demthoigian():void{
    var time = 60;
    this.times = setInterval(()=>{
      time--;
      this.thoigianconlai = time
      if(time<=0){
        // this.router.navigate(['/regsiter'])

      }
    },1000)
  }

  dungDemThoiGian(): void {
    if (this.times) {
      clearInterval(this.times); // Dừng setInterval
    }
  }


  onInputs(): void {
   if(this.isinput1 === false){
    this.isinput1 = true;
    // this.inputField.nativeElement.value=''

    this.isnputField1.nativeElement.value=''
   }else if(this.isinput1 === true){
    // console.log(this.inputField.nativeElement.value)
    // console.log(this.isnputField1.nativeElement.value.slice(1))
    this.valuein2=this.isnputField1.nativeElement.value.slice(1);

    this.chuyensanginput2();
   }
  }
  
  onInputss(): void {
    if(this.isinput2 === false){
      this.isinput2 = true;
      this.insputField2.nativeElement.value=''
     }else if(this.isinput2 === true){
      // console.log(this.inputField.nativeElement.value)
      // console.log(this.insputField2.nativeElement.value.slice(2))
      this.valuein3=this.insputField2.nativeElement.value.slice(2);

      this.chuyensanginput3();
     }
  }

  
  onInputsss(): void {
  
    if(this.isinput3 === false){
      this.isinput3 = true;
      this.inpsutField3.nativeElement.value='' 
     }else if(this.isinput3 === true){
      // console.log(this.inputField.nativeElement.value)
      // console.log(this.inpsutField3.nativeElement.value.slice(3))
      this.valuein4=this.inpsutField3.nativeElement.value.slice(3);
      // console.log(typeof this.inpsutField3.nativeElement.value)


      this.chuyensanginput4();
     }
    
  }
  onInputssss(): void {
  
    if(this.isinput4 === false){
      this.isinput4 = true;
      this.insputField4.nativeElement.value='' 
     }else if(this.isinput4 === true){
      // console.log(this.inputField.nativeElement.value)
      // console.log(this.insputField4.nativeElement.value.slice(4))
      this.valuein5=this.insputField4.nativeElement.value.slice(4);
      // console.log(typeof this.insputField4.nativeElement.value)


      this.chuyensanginput5();
     }
    
  }
  onInputsssss(): void {
  
    if(this.isinput5 === false){
      this.isinput5 = true;
      this.inpsutField5.nativeElement.value='' 
     }else if(this.isinput5 === true){
      // console.log(this.inputField.nativeElement.value)
      // console.log(this.inpsutField5.nativeElement.value.slice(5))
      this.valuein6=this.inpsutField5.nativeElement.value.slice(5);
      // console.log(typeof this.inpsutField5.nativeElement.value)


      // this.chuyensanginput4();
     }
    
  }




  nopotp(){
    
    const otp = [this.inputField.nativeElement.value, this.isnputField1.nativeElement.value, 
      this.insputField2.nativeElement.value,this.inpsutField3.nativeElement.value,this.insputField4.nativeElement.value,
      this.inpsutField5.nativeElement.value
    ]
// console.log(otp);

    const numberString = otp.join('');
    const result = parseInt(numberString);
    // console.log(result)
    this.userservice.checkma(result).subscribe(data =>{
     if(data.ketqua == false){
      // this.router.navigate(['/authenticate'])
      this.saimaotp = true;
     }else if(data.ketqua == true){
      this.dungDemThoiGian();
      this.hienformpassword= true
     }
    })

  }

  dangky(){
    console.log(this.email);
    
    // var email =(this.formemail.get('email')?.value);
    var password = this.formpassword.get('password')?.value;
    var cfpassword = this.formpassword.get('cfpassword')?.value;

    var email = this.email;
    const status = 1
    if(password.length<8){
      this.loipassword=true
    }else if(password !== cfpassword){
      this.loicfpassword = true;
    } 
    
    else{
      // console.log(email,password,cfpassword);
      console.log(email);
      
      const formdata = new FormData()
      formdata.append('email',email);
      formdata.append('password',password);
      formdata.append('status', status.toString());

      console.log(formdata);
      
      this.userservice.dangky(formdata).subscribe(data=>{
        console.log(data);
        if(data == true){
          this.EncryptionService.saveemail(email);
          this.router.navigate(['/setprofile'])

        }
      })
    }
  }



  chuyensanginput1(){
   this.isnputField1.nativeElement.focus()

 

  }
  chuyensanginput2(){
    // console.log()
    this.insputField2.nativeElement.focus()

  }
  chuyensanginput3(){
    this.inpsutField3.nativeElement.focus()

  }
  chuyensanginput4(){
    this.insputField4.nativeElement.focus()

  }
  chuyensanginput5(){
    this.inpsutField5.nativeElement.focus()

  }
}
