import { Component, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "app-video",
  templateUrl: "./video.component.html",
  styleUrls: ["./video.component.css"],
})
export class VideoComponent implements OnInit {
  @ViewChild("me", { static: false })
  me: any;
  @ViewChild("remote", { static: true })
  remote: any;

  callActive: boolean = false;
  pc: any;
  localStream: any;
  senderId: string;
  isLoading: boolean = false;

  constructor() {}

  ngOnInit() {
    this.setupWebRtc();
  }

  public ngOnDestroy() {
    this.pc.close();
    let tracks = this.localStream.getTracks();
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].stop();
    }
    this.callActive = false;
  }

  setupWebRtc() {
    this.senderId = this.guid();

    try {
      this.pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.services.mozilla.com" },
          { urls: "stun:stun.l.google.com:19302" },
        ],
      });
    } catch (error) {
      console.log(error);
      this.pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.services.mozilla.com" },
          { urls: "stun:stun.l.google.com:19302" },
        ],
      });
    }

    this.pc.onicecandidate = (event) => {
      event.candidate
        ? this.sendMessage(
            this.senderId,
            JSON.stringify({ ice: event.candidate })
          )
        : console.log("Sent All Ice");
    };

    this.pc.onremovestream = (event) => {
      console.log("Stream Ended");
    };

    this.pc.ontrack = (event) =>
      (this.remote.nativeElement.srcObject = event.streams[0]); // use ontrack
    this.showMe();
  }

  sendMessage(senderId, data) {
    // var msg = this.channel.push({ sender: senderId, message: data });
    // msg.remove();
  }

  readMessage(data) {
    if (!data) return;
    try {
      var msg = JSON.parse(data.val().message);
      let personalData = data.val().personalData;
      var sender = data.val().sender;
      if (sender != this.senderId) {
        if (msg.ice != undefined && this.pc != null) {
          this.pc.addIceCandidate(new RTCIceCandidate(msg.ice));
        } else if (msg.sdp.type == "offer") {
          this.callActive = true;
          this.pc
            .setRemoteDescription(new RTCSessionDescription(msg.sdp))
            .then(() => this.pc.createAnswer())
            .then((answer) => this.pc.setLocalDescription(answer))
            .then(() =>
              this.sendMessage(
                this.senderId,
                JSON.stringify({ sdp: this.pc.localDescription })
              )
            );
        } else if (msg.sdp.type == "answer") {
          this.callActive = true;
          this.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  showMe() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => (this.me.nativeElement.srcObject = stream))
      .then((stream) => {
        this.pc.addStream(stream);
        this.localStream = stream;
      });
  }

  showRemote() {
    try {
      this.pc
        .createOffer()
        .then((offer) => this.pc.setLocalDescription(offer))
        .then(() => {
          this.sendMessage(
            this.senderId,
            JSON.stringify({ sdp: this.pc.localDescription })
          );
          this.callActive = true;
        });
    } catch (error) {
      this.setupWebRtc();
      console.log(error);
    }
  }

  hangup() {
    this.pc.close();
    let tracks = this.localStream.getTracks();
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].stop();
    }
    this.callActive = false;
  }

  guid() {
    return (
      this.s4() +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      this.s4() +
      this.s4()
    );
  }
  s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
}
