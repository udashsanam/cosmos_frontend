import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    const localVideo = document.querySelector('.local-video');

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.muted = true;
        video.play();
        localVideo.appendChild(video); 
      })
      .catch((error) => {
        console.log('Error accessing media devices', error);
      });


  }

}
