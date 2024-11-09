import { Component,OnInit } from '@angular/core';
import { io } from 'socket.io-client';


@Component({
  selector: 'app-testvideo',
  templateUrl: './testvideo.component.html',
  styleUrl: './testvideo.component.css'
})
export class TestvideoComponent implements OnInit{

  private socket = io('http://localhost:3001/');
  private localStream!: MediaStream;
  private peerConnection!: RTCPeerConnection; 
  public localVideo!: HTMLVideoElement; 
  public remoteVideo!: HTMLVideoElement; 
  private isCaller = false; // Biến để theo dõi ai là người gọi

  ngOnInit() {
    this.localVideo = document.getElementById('localVideo') as HTMLVideoElement;
    this.remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
    // console.log('bat dau');

  }

  startVideoCall() {
    const constraints = { video: true, audio: true };

    navigator.mediaDevices.getUserMedia(constraints)
    
      .then(stream => {
        this.localStream = stream;
        this.localVideo.srcObject = stream;
        this.createPeerConnection(); // Tạo PeerConnection
        this.localStream.getTracks().forEach(track =>{ 
          // console.log('track đc thêm');
          // console.log(track);
          this.peerConnection.addTrack(track, this.localStream)}
        
          
        );
       
      })
      .catch(error => {
        console.error('Error accessing media devices.', error);
      });

      


      this.socket.on('offer', (offer) => { // Lắng nghe offer từ người khác
        // console.log('Đã nhận offer của người khác:', offer);
        this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
          .then(() => {
            this.createAnswer(); // Trả lời cho offer
          })
          .catch(error => {
            console.error('Error setting remote description:', error);
          });
          // console.log(this.peerConnection);

      });
      
      this.socket.on('answer', (answer) => { // Lắng nghe answer từ người khác
        // console.log('Đã nhận answer của người khác:', answer);
        this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
          .catch(error => {
            console.error('Error setting remote description:', error);
          });
          console.log(this.peerConnection);

      });

    this.socket.on('icecandidate', (candidate) => { // Lắng nghe ice candidate
      this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        .catch(error => {
          console.error('Error adding received ice candidate:', error);
        });
    });
  }

  createPeerConnection() {
    var servers = {'iceServers': [
      {'urls': 'stun:stun.services.mozilla.com'},
      {'urls': 'stun:stun.l.google.com:19302'}
  ]};
    this.peerConnection = new RTCPeerConnection(servers);
    // console.log(this.peerConnection);
    
    // console.log('load oo');
    

    this.peerConnection.onicecandidateerror = (event) =>{
      console.log(event);
      
    }
    this.peerConnection.onicecandidate=(event) => {

      // console.log(event.cancelable)
      
      console.log('đã vô onice');
      
        console.log('Đã gửi ice candidate:', event.candidate);
        this.socket.emit('icecandidate', event.candidate); // Gửi candidate tới server
      
    };
    // console.log(this.peerConnection);
    
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
        // console.log('offer của mình');
        // console.log(this.peerConnection.localDescription);
        
        
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
      // console.log(this.peerConnection);

      this.socket.emit('answer', this.peerConnection.localDescription);
       // Gửi answer tới server
       console.log("answer của mình");
      //  console.log( this.peerConnection.localDescription);
       
       
    } catch (error) {
      console.error('Error creating answer:', error);
    }
  }
}
