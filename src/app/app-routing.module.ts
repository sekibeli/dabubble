import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './start/start.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { PostContainerComponent } from './post-container/post-container.component';
import { MainComponent } from './main/main.component';
import { ChatComponent } from './chat/chat.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { ChooseAvatarComponent } from './choose-avatar/choose-avatar.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';


const routes: Routes = [
  {path: '', redirectTo: 'start', pathMatch: 'full'},
  {path: 'start', component: StartComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignUpComponent},
  {path: 'impressum', component: ImpressumComponent},
  {path: 'avatar', component: ChooseAvatarComponent},
  {path: 'forgotPassword', component: ForgotPasswordComponent},
  {path: 'newpassword', component: NewPasswordComponent},
  {path: 'home', component: HomeComponent,

children: [
  {path:'', component: MainComponent},
  {path:'channel/:id', component: PostContainerComponent},
  {path:'chat/:id', component: ChatComponent}
]},
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
