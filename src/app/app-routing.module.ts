import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, AuthTokenGuard} from './shared';
// import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
    {
      path: '',
      // component: SignupComponent,
      loadChildren: () => import('./signup/signup.module').then(m => m.SignupModule),
      pathMatch: 'full'
    },
    {
      path: 'signin',
      loadChildren: () => import('./signup/signup.module').then(m => m.SignupModule),
      pathMatch: 'full'
    },
    { path: 'registertion', loadChildren: () => import('./registration/registration.module').then(m => m.RegistrationModule) },
    { path: 'verification', loadChildren: () => import('./verification/verification.module').then(m => m.VerificationModule) },
    { path: 'password-setup', loadChildren: () => import('./password-setup/password-setup.module').then(m => m.PasswordSetupModule) },
    { path: 'login-callback', loadChildren: () => import('./passwordless-auth/passwordless-auth.module').then(m => m.PasswordlessAuthModule) },
    { path: '', loadChildren: () => import('./admin-organization/admin-organization.module').then(m => m.AdminOrganizationModule),canActivate:[AuthGuard] },
    { path: '', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule), canActivate: [AuthGuard] },
    { path: '', loadChildren: () => import('./project-dashboard/project-dashboard.module').then(m => m.ProjectDashboardModule), canActivate: [AuthGuard] },
    { path: '', loadChildren: () => import('./owner/owner.module').then(m => m.ownerModule), canActivate: [AuthGuard] },
    { path: 'reset-pwd', loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordModule) },
    { path: 'privacy-policy', loadChildren: () => import('./privicy-policy/privicy-policy.module').then(m => m.privicyPolicyModule) },
    {
      path: '**',
      redirectTo: 'dashboard-user'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}