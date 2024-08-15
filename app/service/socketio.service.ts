import { Injectable } from '@angular/core';
import { Observable, observeOn } from 'rxjs';
import {io, Socket}from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  private socket:Socket;

  constructor() {
    this.socket = io('http://localhost:3001');
  }
  public sendOnlineStatus( id_user:any): void {
    this.socket.emit('online', id_user);
  }

  public sendNotification(id_user: string, thongtin:string): void {
    this.socket.emit('notifyUser', id_user,thongtin);
  }
  public getNotifications(): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.on('notification', (message: string) => {
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
