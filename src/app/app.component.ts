import { Component, OnInit } from "@angular/core";
import * as Stomp from "stompjs";
import { AuthenticationService } from "./auth/authentication.service";
import { WebSocketSubject } from "rxjs/webSocket";

import {
  Router,
  NavigationEnd,
  NavigationStart,
  RouterOutlet,
} from "@angular/router";
import { AppService } from "./app.service";
import { hammerjs } from "node_modules/hammerjs";
import { WebSocketService } from "./wesocket.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "EventusEventRegistrationV1-frontend";
  hammerjs = hammerjs;
  userRole;

  _authService: AuthenticationService;
  // selectNavbar = 0;
  reloginOverlay = false;
  loading: boolean;
  socket: WebSocket;

  content = "";
  received = [];
  sent = [];
  messages: any[];

  constructor(
    private authService: AuthenticationService,
    private _router: Router, // private _appService: AppService,
    private _websocketService: WebSocketService
  ) {
    this._authService = authService;
    this.loading = true;
    // this.func();
  }

  ngOnInit() {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (event instanceof NavigationEnd) {
        this.loading = false;
        // this.selectNavbarFunc();
      }
    });

    if (this._authService.getToken() !== null) {
      this.userRole = this._authService.currentUser.auth;
    }

    this.anotherWebSocket();
  }

  // selectNavbarFunc() {
  //   const currentUrl = this._router.url;
  //   const temp = currentUrl.split("/");

  //   switch (temp[1]) {
  //     case "login":
  //       this.selectNavbar = 0;
  //       break;

  //     default:
  //       this.selectNavbar = 1;
  //   }
  // }
  sendMsg() {}

  func() {
    if ("WebSocket" in window) {
      // add token to a rquest when connect with WebSocket

      const ws = new WebSocket("ws://139.144.169.177:8282/socket");

      var stompClient = Stomp.over(ws);
      // connect with token

      ws.addEventListener("open", (event) => {
        console.log("Socket connection established");
      });

      stompClient.connect(
        {
          token: "token: " + this._authService.getToken(),
        },
        function (frame) {
          console.log("Connected: " + frame);
        },
        (error) => {
          console.log(error);
        }
      );

      ws.onerror = (x) => {
        //console.log("Socket error", x);
        console.log("Socket error", x);
      };

      ws.onopen = (x) => {
        //console.log("Socket connection established");
        console.log("Socket connection established", x);
      };

      ws.onmessage = (message) => {
        //console.log("New Message received ", message.data);
        const msg = JSON.parse(message.data);
      };

      ws.onclose = () => {
        //console.log("Socket connection closed");
      };
    } else {
      // The browser doesn't support WebSocket
      alert("WebSocket NOT supported by your Browser!");
    }
  }

  newWebSocket() {
    const token =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjb3Ntb3Nhc3Ryb2xvZ3kuMTEyQGdtYWlsLmNvbSIsImRpc3BsYXlOYW1lIjoiQ29zbW9zIEFzdHJvbG9neSIsImFwcFVzZXJJZCI6MSwiYXV0aCI6IlJPTEVfQURNSU4iLCJpYXQiOjE2ODIzOTk0MjV9.uxVHWLUC-rmSfk3rMAKAJnMEjMBu59JGygh4ZtC_xKg";

    const webSocket = new WebSocketSubject({
      url: "ws://139.144.169.177:8282/socket",
      protocol: token,
    });

    webSocket.next("message to send");

    webSocket.subscribe((msg) => {
      console.log("message received: " + msg);
    });
  }

  anotherWebSocket() {
    const webSocketUrl = "ws://139.144.169.177:8282/socket";
    const token =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjb3Ntb3Nhc3Ryb2xvZ3kuMTEyQGdtYWlsLmNvbSIsImRpc3BsYXlOYW1lIjoiQ29zbW9zIEFzdHJvbG9neSIsImFwcFVzZXJJZCI6MSwiYXV0aCI6IlJPTEVfQURNSU4iLCJpYXQiOjE2ODIzOTk0MjV9.uxVHWLUC-rmSfk3rMAKAJnMEjMBu59JGygh4ZtC_xKg";

    const webSocket = new WebSocket(webSocketUrl, ["token", token]);

    webSocket.onopen = (event) => {
      console.log("WebSocket connection established.");
    };

    webSocket.onmessage = (event) => {
      console.log("Received message:", event.data);
    };

    webSocket.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
    };

    webSocket.onerror = (event) => {
      console.error("WebSocket occured error:", event);
    };
  }

  anotherNewWebSocket() {
    const url = "ws://139.144.169.177:8282/socket";
    const token = "05f22fd30883f5e5";

    const socket = new WebSocket(url);
    socket.addEventListener("open", function (event) {
      console.log("WebSocket connection established!");
      socket.send(
        JSON.stringify({
          headers: {
            token: token,
          },
          data: "Hello server!",
        })
      );
    });

    socket.addEventListener("message", function (event) {
      console.log("Message from server:", event.data);
    });

    socket.addEventListener("error", function (event) {
      console.error("WebSocket error:", event);
    });

    socket.addEventListener("close", function (event) {
      console.log("WebSocket connection closed:", event);
    });
  }
}
