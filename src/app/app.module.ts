import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StartComponent } from './start/start.component';
import { LoginComponent } from './login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { GoogleLoginCardComponent } from './google-login-card/google-login-card.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LeftDrawerComponent } from './left-drawer/left-drawer.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { PostContainerComponent } from './post-container/post-container.component';
import { InputComponent } from './input/input.component';
import { PostheaderComponent } from './postheader/postheader.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { MainComponent } from './main/main.component';
import { ThreadContainerComponent } from './thread-container/thread-container.component';
import { ThreadDetailComponent } from './thread-detail/thread-detail.component';
import { ObjectToArrayPipe } from './object-to-array.pipe';
import { SinglePostComponent } from './single-post/single-post.component';
import { HeaderComponent } from './header/header.component';
import { ChatComponent } from './chat/chat.component';
import { ChatHeaderComponent } from './chat-header/chat-header.component';
import { ChatContainerComponent } from './chat-container/chat-container.component';
import { ChatDetailComponent } from './chat-detail/chat-detail.component';
import { ChatNoMessageComponent } from './chat-no-message/chat-no-message.component';
import { UserComponent } from './user/user.component';
import { DialogNewChannelComponent } from './dialog-new-channel/dialog-new-channel.component';
import { ChannelComponent } from './channel/channel.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogAddMemberComponent } from './dialog-add-member/dialog-add-member.component';
import { DialogShowChanneluserComponent } from './dialog-show-channeluser/dialog-show-channeluser.component';
import { DialogProfileComponent } from './dialog-profile/dialog-profile.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { DialogLogoutComponent } from './dialog-logout/dialog-logout.component';
import { MatButtonModule } from '@angular/material/button';
import { ChooseAvatarComponent } from './choose-avatar/choose-avatar.component';
import { HttpClientModule } from '@angular/common/http';
import { DialogEditUserComponent } from './dialog-edit-user/dialog-edit-user.component';
import { DialogShowChannelComponent } from './dialog-show-channel/dialog-show-channel.component';
import { InputPostComponent } from './input-post/input-post.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { SnackComponent } from './snackbar/snack/snack.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { DialogAddMemberToNewChannelComponent } from './dialog-add-member-to-new-channel/dialog-add-member-to-new-channel.component';
import { MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule } from '@angular/material/radio';
import { NewMessageContainerComponent } from './new-message-container/new-message-container.component';
import { DialogEditImageComponent } from './dialog-edit-image/dialog-edit-image.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { InputThreadComponent } from './input-thread/input-thread.component';
import { EmojiPickerComponent } from './emoji-picker/emoji-picker.component';





@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    LoginComponent,
    GoogleLoginCardComponent,
    SignUpComponent,
    HomeComponent,
    UserProfileComponent,
    LeftDrawerComponent,
    PostContainerComponent,
    InputComponent,
    PostheaderComponent,
    PostDetailComponent,
    MainComponent,
    ThreadContainerComponent,
    ThreadDetailComponent,
    ObjectToArrayPipe,
    SinglePostComponent,
    HeaderComponent,
    ChatComponent,
    ChatHeaderComponent,
    ChatContainerComponent,
    ChatDetailComponent,
    ChatNoMessageComponent,
    UserComponent,
    DialogNewChannelComponent,
    ChannelComponent,
    DialogAddMemberComponent,
    DialogShowChanneluserComponent,
    DialogProfileComponent,
    ImpressumComponent,
    DialogLogoutComponent,
    ChooseAvatarComponent,
    DialogEditUserComponent,
    DialogShowChannelComponent,
    InputPostComponent,
    SearchbarComponent,
    SnackComponent,
    ForgotPasswordComponent,
    NewPasswordComponent,
    DialogAddMemberToNewChannelComponent,
    NewMessageContainerComponent,
    DialogEditImageComponent,
    InputThreadComponent,
    EmojiPickerComponent



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    AngularFireModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    FormsModule,
    MatSidenavModule,
    MatButtonModule,
    HttpClientModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatRadioModule,
    PickerComponent,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),

    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
