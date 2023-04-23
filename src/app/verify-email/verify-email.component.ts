import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})

export class VerifyEmailComponent implements OnInit {

  newPassword: string;
  confirmPassword: string;
  currentPassword: string;

  passwordsMatch() {
    if (!this.currentPassword || !this.newPassword) {
      return false; // current password is blank
    }
    if (this.newPassword.length < 6) {
      return false; // new password is too short
    }
    return this.newPassword === this.confirmPassword;
  }

  differentPassword: boolean = false;


  email: string;
  token: string;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {

    // let currentPassword = document.getElementById('currentPassword');

    this.route.queryParams.subscribe(params => {
      if (params['email'] && params['token']) {
        this.email = params['email'];
        console.log(this.email)

        this.token = params['token'];
        console.log(this.token);
        // use the values of the parameters as needed

      }
    });
  }

  submit(event: Event) {
    console.log('button pressed');

    if (event) {
      event.preventDefault();
    }

    // fields to be sent to backend
    // email
    // currentPassword
    // newPassword
    // token

    const data = {
      email: this.email,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      token: this.token
    };

    console.log(`payload: ${JSON.stringify(data)}`);

    // payload
    //token in header?

    // "email":"udashsanam@gmail.com","currentPassword":"askldjfks","newPassword":"aaaaaa","token":"ce3eddc6-7d91-4920-b781-8ba7adf5e52a"}

    try {
      // TODO: replace this with working url from baseUrl
      this.http.post("https://system.cosmosastrology.com/#/api/verify-email", data)
        .subscribe(
          response => console.log(response),
          error => console.log(error)
        );
    } catch (error) {

    }

  }

}