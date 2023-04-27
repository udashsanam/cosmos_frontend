import { Injectable } from "@angular/core";
import { WebSocketSubject } from "rxjs/webSocket";

export interface Message {
  source: string;
  content: string;
}
@Injectable()
export class AppService {
  private webSocket$: WebSocketSubject<any>;

  constructor() {
    const url = "ws://139.144.169.177:8282/socket";
    const token = "05f22fd30883f5e5";
    // const protocol = token ? ["token: " + token] : undefined;
    this.webSocket$ = new WebSocketSubject(url);
  }

  public getWebSocketSubject(): WebSocketSubject<any> {
    return this.webSocket$;
  }
}
