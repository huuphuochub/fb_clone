import { Injectable } from '@angular/core';
import { Observable, observeOn } from 'rxjs';
import {io, Socket}from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  private socket:Socket;

  constructor() {
    // this.socket = io('http://192.168.2.39:3001/')
      this.socket = io('http://localhost:3001/')
    // this.socket = io('http://172.16.98.157:3001/')
    // this.socket = io('https://huuphuoc.test.huuphuoc.id.vn/');
    


    // this.socket = io('http://192.168.2.39:3001/');
  }
  public sendOnlineStatus( id_user:any): void {
    
      this.socket.emit('online', id_user);
    
  }
  public sendmess( id_user:any,id_room:any): void {
    this.socket.emit('sendmess', id_user,id_room);
  }
  public deleteonline( id_user:any): void {
    this.socket.emit('deleteonline', id_user);
  }

  public receicemess(): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.on('receicemess', (message: string) => {
        // console.log(message)
        observer.next(message);
      });
    });
  }


  public sendNotification(id_user: string, thongtin:string): void {
    this.socket.emit('notifyUser', id_user,thongtin);
  }

  
  public userLogout(id_user: string): void {
    this.socket.emit('userLogout', id_user);
  }
  public getNotifications(): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.on('notification', (message: string) => {
        // console.log(message)
        observer.next(message);
      });
    });
  }

  public sendNotificationfriend(id_user: string, thongtin:string): void {
    this.socket.emit('notifyfriend', id_user,thongtin);
  }
  public getNotificationsfriend(): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.on('notifyfriend', (message: string) => {
        // console.log(message)
        observer.next(message);
      });
    });
  }








  public getfriendonline():Observable<string>{
    return new Observable<string>(observer =>{
      this.socket.on('frienonline', (message:string) =>{
        // console.log(message)
        observer.next(message)
      })
    })
  }
  public getallfriendonline():Observable<string>{
    return new Observable<string>(observer =>{
      this.socket.on('getallfriendonline', (message:string) =>{
        // console.log(message)
        observer.next(message)
      })
    })
  }

  public getfriendoffline():Observable<string>{
    return new Observable<string>(observer =>{
      this.socket.on('friendofline', (message:string) =>{
        // console.log(message)
        observer.next(message)
      })
    })
  }

  


//   public sendMessage(message: string) {
//     this.socket.emit('message', message);
//   }

//   public getMessages(): Observable<string> {
//     return new Observable<string>(observer => {
//       this.socket.on('message', (data: string) => {
//         console.log(data)
//         observer.next(data);
//       });

//       return () => {
//         this.socket.disconnect();
//       };
//     });
//   }
}
