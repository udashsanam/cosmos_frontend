import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { appRoutes } from './routes';
import { AppService } from './app.service';
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { ModeratorsModule } from './moderators/moderators.module';
import { SharedModule } from './shared/shared.module';
import { AstrologersModule } from './astrologers/astrologers.module';
import { CountUpModule } from 'ngx-countup';
import { ChartsModule } from 'ng2-charts';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import { VideoComponent } from './video/video.component';
import { TestComponent } from './test/test.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { FormsModule } from '@angular/forms';


export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    VideoComponent,
    TestComponent,
    VerifyEmailComponent,
  ],
  imports: [
    AuthModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ChartsModule,
    CountUpModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-left',
      preventDuplicates: true
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [
          'system.cosmosastrology.com',
          '192.168.1.99:8082',
        ],
        blacklistedRoutes: []
      }
    }),
    RouterModule.forRoot(appRoutes),
    ModalModule.forRoot(),
    NgxSpinnerModule,

    // CUSTOM MODULES 
    AdminModule,
    ModeratorsModule,
    AstrologersModule
    // END OF CUSTOM MODULES 
  ],
  providers: [AppService,
    {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
