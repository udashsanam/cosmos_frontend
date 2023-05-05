import { MatDialogModule } from "@angular/material/dialog";
import { Component } from "@angular/core";
import { AuthenticationService } from "./auth/authentication.service";

import { Router, NavigationEnd, NavigationStart } from "@angular/router";
import { hammerjs } from "node_modules/hammerjs";
import { WebSocketService } from "./websocket.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  isSHow = false;
  title = "EventusEventRegistrationV1-frontend";
  hammerjs = hammerjs;
  userRole;
  message: any;

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
    private _websocketService: WebSocketService,
    private _modalService: MatDialogModule
  ) {
    this._authService = authService;
    this.loading = true;

    _websocketService.connect(" " + authService.getToken());
  }

  ngOnInit() {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (event instanceof NavigationEnd) {
        this.loading = false;
        // this.selectNavbarFunc();
        this.subscribeMessage();
      }
    });

    if (this._authService.getToken() !== null) {
      this.userRole = this._authService.currentUser.auth;
    }
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

  private subscribeMessage() {
    this._websocketService.subscribe("/user/topic/video/chat", (msg: any) => {
      let m = JSON.parse(msg.body);
      console.log(m);
      this.message = m;
      this.isSHow = true;

      this.playSound();
    });
  }

  end() {
    this.isSHow = !this.isSHow;
  }

  playSound() {
    let audio = new Audio();
    audio.src = "../assets/sounds.wav";
    audio.load();
    this.isSHow ? audio.play() : audio.pause();
  }

  sendSignal() {
    this.isSHow = !this.isSHow;
    this._websocketService
      .sendPrivateMessage({
        data: this.message.data,
        receiver: this.message.sender,
      })
      .subscribe(
        (res) => {
          this._router.navigate(["/video/", this.guid()]);
          // open new tab outside

          window.open(
            "http://localhost:4200/video/" +
              this.guid() +
              "?token=" +
              this._authService.getToken()
          );
        },
        (err) => {
          console.log(err);
          if (err.error.text === "successfully send") {
            this._router.navigate(["/video/", this.guid()]);
          }
        }
      );
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
