import { Component,OnInit } from '@angular/core';
import { io } from 'socket.io-client';


@Component({
  selector: 'app-testvideo',
  templateUrl: './testvideo.component.html',
  styleUrl: './testvideo.component.css'
})
export class TestvideoComponent implements OnInit{

  private socket = io('http://192.168.2.39:3001/');
  private localStream!: MediaStream;
  private peerConnection!: RTCPeerConnection; // Sử dụng toán tử `!`
  public localVideo!: HTMLVideoElement; // Sử dụng toán tử `!`
  public remoteVideo!: HTMLVideoElement; // Sử dụng toán tử `!`

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

        this.createPeerConnection(); // tạo 1 peer

        this.localStream.getTracks().forEach(track => 
          this.peerConnection.addTrack(track, this.localStream)
        );
      });

    this.socket.on('offer', (offer) => { // lắng nghe offer từ người khác
      console.log(offer)
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      this.createAnswer(); // trả lời cho offer vừa nghe đc
    });

    this.socket.on('answer', (answer) => {   
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));  // lắng nghe câu trả lời
    });

    this.socket.on('ice-candidate', (candidate) => {
      this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));  
    });
  }

  createPeerConnection() {
    this.peerConnection = new RTCPeerConnection(); // tạo 1 peer 

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', event.candidate);  // thiết lập kết nối
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.remoteVideo.srcObject = event.streams[0];
    };

    this.peerConnection.createOffer()
      .then(offer => {
        this.peerConnection.setLocalDescription(offer);
        this.socket.emit('offer', offer);  // tạo offer và gửi về server
      });
  }

  createAnswer() {
    this.peerConnection.createAnswer()
      .then(answer => {
        this.peerConnection.setLocalDescription(answer); // trả lời
        this.socket.emit('answer', answer);
      });
  }

}
