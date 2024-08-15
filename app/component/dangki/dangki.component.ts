import { Component, OnInit } from '@angular/core';
import { Userservice } from '../../service/userservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sharedataservice } from '../../service/sharedata.service';
import { Route, Router } from '@angular/router';


@Component({
  selector: 'app-dangki',
  templateUrl: './dangki.component.html',
  styleUrls: ['./dangki.component.css'] // Fixed 'styleUrl' to 'styleUrls'
})
export class DangkiComponent implements OnInit {
  formemail!: FormGroup;
  loiemail:boolean = false;
  emailtontai:boolean = false;

  constructor(private userservice: Userservice, private formbuilder: FormBuilder,private sharedataservice:Sharedataservice,private router:Router) {
    this.formemail = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]] // Added Validators.email
    });
  }

  ngOnInit(): void {
    // Additional initialization logic can go here
  }

  // Method to check if the email is valid
  isEmailValid(): boolean {
    return this.formemail.get('email')?.valid || false;
  }

  checkemail():void{
    var email =(this.formemail.get('email')?.value);
    console.log(email)
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; 
    if (!filter.test(email)) { 
     this.loiemail = true;
     
    }
    else{ 
      this.userservice.checkemail(email).subscribe(data=>{
        console.log(data.thongbao)
        if(data.thongbao == true){
          this.sharedataservice.setEmailsubject(email);
          this.userservice.guima(email).subscribe();
          this.router.navigate(['/authenticate'])

        }else if(data.thongbao == false){
          this.emailtontai= true;
        }
      })
} 
  }
}
