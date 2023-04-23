import { Routes } from "@angular/router";
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { UserQaHistoryComponent } from './shared/user-qa-history/user-qa-history.component';
import { ForgotPasswordComponent } from './shared/forgot-password/forgot-password.component';
import { VideoComponent } from "./video/video.component";
import { AdminDashboardComponent } from "./admin/admin-dashboard/admin-dashboard.component";
import { TestComponent } from "./test/test.component";
import { AstrologersTaskComponent } from "./astrologers/astrologers-task/astrologers-task.component";
import { VerifyEmailComponent } from "./verify-email/verify-email.component";

export const appRoutes: Routes = [
    {
        path: "api/verify-email",
        component: VerifyEmailComponent
    },
    {
        path: "test",
        component: TestComponent
    },
    {
        path: "dash",
        component: AdminDashboardComponent
    },
    {
        path: "astro-dash",
        component: AstrologersTaskComponent
    },
    {
        path: "video",
        component: VideoComponent
    },
    {
        path: "login",
        canLoad: [AuthGuard],
        // canLoad: [() => true],
        component: LoginComponent
    },
    {
        path: "forgot-password/:email",
        component: ForgotPasswordComponent
    },
    {
        path: "forgot-password",
        redirectTo: "forgot-password/",
        pathMatch: "full"
    },
    {
        path: "admin",
        loadChildren: "./admin/admin.module#AdminModule"
    }
    // {
    //     path: '',
    //     redirectTo: '/login',
    //     pathMatch: 'full'
    // },
];
