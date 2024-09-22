import { Component,OnInit } from '@angular/core';
import { io } from 'socket.io-client';


@Component({
  selector: 'app-testvideo',
  templateUrl: './testvideo.component.html',
  styleUrl: './testvideo.component.css'
})
export class TestvideoComponent implements OnInit{
  private socket = io('http://192.168.2.39:3001/')

  // private socket = io('https://huuphuoc.test.huuphuoc.id.vn/');
  private localStream!: MediaStream;
  private peerConnection!: RTCPeerConnection; 
  public localVideo!: HTMLVideoElement; 
  public remoteVideo!: HTMLVideoElement; 
  private isCaller = false; // Biến để theo dõi ai là người gọi

  ngOnInit() {
    this.localVideo = document.getElementById('localVideo') as HTMLVideoElement;
    this.remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
    this.startVideoCall();
  }

  startVideoCall() {
    const constraints = { video: true, audio: true };

    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        this.localStream = stream;
        this.localVideo.srcObject = stream;

        this.createPeerConnection(); // Tạo PeerConnection
        this.localStream.getTracks().forEach(track => 
          this.peerConnection.addTrack(track, this.localStream)
        );
      })
      .catch(error => {
        console.error('Error accessing media devices.', error);
      });

    this.socket.on('offer', (offer) => { // Lắng nghe offer từ người khác
      console.log('Đã nhận offer:', offer);
      if (this.isCaller) {
        this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
          .then(() => {
            this.isCaller = true; // Đánh dấu là người gọi
            this.createAnswer(); // Trả lời cho offer
          })
          .catch(error => {
            console.error('Error setting remote description:', error);
          });
      }
    });

    this.socket.on('answer', (answer) => { // Lắng nghe answer từ người khác
      console.log('Đã nhận answer của người khác:', answer);
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
        .catch(error => {
          console.error('Error setting remote description:', error);
        });
    });

    this.socket.on('icecandidate', (candidate) => { // Lắng nghe ice candidate
      this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        .catch(error => {
          console.error('Error adding received ice candidate:', error);
        });
    });
  }

  createPeerConnection() {
    var configuration = { 
      "iceServers": [{ "url": "stun:stun.1.google.com:19302" }] 
   }; 
    this.peerConnection = new RTCPeerConnection();
    console.log(this.peerConnection);
    
    // console.log('load oo');
    

    
    // this.peerConnection.onicecandidate = (event) => {
    //   console.log(event.cancelable)
    //   // console.log('đã vô onice');
      
    //   if (event.candidate) {
    //     console.log('Đã gửi ice candidate:', event.candidate);
    //     this.socket.emit('icecandidate', event.candidate); // Gửi candidate tới server
    //   }
    // };

    this.peerConnection.ontrack = (event) => {
      console.log('Đang tạo video từ remote track');
      this.remoteVideo.srcObject = event.streams[0];
    };

    // Tạo offer ngay khi PeerConnection được tạo
    this.peerConnection.createOffer()
      .then(offer => {
        return this.peerConnection.setLocalDescription(offer);
      })
      .then(() => {
        this.isCaller = true; // Đánh dấu là người gọi
        console.log('offer của mình' + this.peerConnection.localDescription);
        
        this.socket.emit('offer', this.peerConnection.localDescription); // Gửi offer tới server
      })
      .catch(error => {
        console.error('Error creating offer:', error);
      });
  }

  async createAnswer() {
    try {
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.socket.emit('answer', this.peerConnection.localDescription);
       // Gửi answer tới server
       console.log("answer của mình" + this.peerConnection.localDescription);
       
    } catch (error) {
      console.error('Error creating answer:', error);
    }
  }
}
