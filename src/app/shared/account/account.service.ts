import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ChangePasswordModel } from "./change-password/change-password.model";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AccountService {
  private ROOT_URL = environment.baseUrl;
  private MODERATORS = `${this.ROOT_URL}/change-password`;

  constructor(private httpClient: HttpClient) {}

  changePassword(changePasswordModel: ChangePasswordModel): Observable<any> {
    return this.httpClient.post<ChangePasswordModel>(
      this.MODERATORS,
      changePasswordModel
    );
  }
}

export interface ErrorModel {
  debugMessage: string;
  message: string;
  status: string;
  timestamp: Date;
}
