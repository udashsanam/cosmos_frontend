import { Injectable } from "@angular/core";
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class WebSocketService {
  // write with stomp js and sockjs client

  webSocketEndPoint: string = "http://139.144.169.177:8282/api/stomp";
  topic: string = "/user/topic/video/chat";
  stompClient: any;
  token: string;

  constructor(private http: HttpClient) {}

  connect(token: string) {
    this.token = token;

    const ws = new SockJS(this.webSocketEndPoint);

    this.stompClient = Stomp.over(ws);

    const _this = this;

    _this.stompClient.connect(
      { token: token },
      function (frame) {
        _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
          _this.onMessageReceived(sdkEvent);
        });
        _this.stompClient.reconnect_delay = 2000;
      },

      this.errorCallBack
    );
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  // on error, schedule a reconnection attempt

  errorCallBack(error) {
    console.log("errorCallBack -> " + error);
    setTimeout(() => {
      this.connect(this.token);
    }, 5000);
  }

  // on message received, parse JSON message and notify subscribers

  onMessageReceived(message) {
    console.log("Message Recieved from Server :: " + message);
  }

  // send message to sever via web socket

  send(message, token) {
    console.log("calling logout api via web socket");
    this.stompClient.send(
      "/app/hello",
      { token: token },
      JSON.stringify(message)
    );
  }

  subscribe(topic: string, callback?: any) {
    const connected: boolean = this.stompClient.connected;

    if (connected) {
      this.stompClient.subscribe(topic, callback);
      return;
    }

    this.stompClient.connect(
      {
        token: this.token,
      },
      () => {
        this.stompClient.subscribe(topic, callback);
      }
    );
  }

  sendPrivateMessage(message: any) {
    return this.http.post(
      environment.webSocketUrl + "/video-chat/sendMessage",

      message,
      {
        headers: {
          Authorization: `Bearer` + this.token,
        },
      }
    );
  }
}
