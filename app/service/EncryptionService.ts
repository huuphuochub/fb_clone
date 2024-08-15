import { Injectable } from '@angular/core';
// import { environment } from '../environment'; 


@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
    public saveemail(email:any){
            const emails = btoa(email);
            localStorage.setItem('email',emails);
    }
    public getemail(){
        const email = localStorage.getItem('email')
       if(email){
        const emails = atob(email);
        return emails
       }else {
        return null;
       }
    }
 
}
