import { Injectable } from "@angular/core";
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";

@Injectable({
  providedIn: "root",
})
export class WebSocketService {
  stompClient: any;
  topic: string;

  constructor() {}

  suscribe() {
    let ws = new SockJS(`ws://139.144.169.177:8282/socket`, null, {
      rejectUnauthorized: false,
    });
    this.stompClient = Stomp.over(ws);
    this.stompClient.debug = () => {};
    const _this = this;
    _this.stompClient.connect(
      { Authorization: "token " + localStorage.getItem("token") },
      function (frame) {
        _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
          console.log(sdkEvent);
        });
      },
      function (er) {
        console.log(er);

        setTimeout(() => _this.suscribe(), 5000);
      }
    );
  }
}
