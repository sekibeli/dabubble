import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AutologoutService {
  currentUser; 
  private idleTimeLimit: number = 60 * 60 * 1000; // 60 Minuten in Millisekunden
  private timer;
  
  
  constructor(private auth:AngularFireAuth, private route:Router, private userService:UserService) { 
    this.currentUser = localStorage.getItem('currentUserID');
    this.startListener();
   
  }

  startListener(){
    window.addEventListener('mousemove', ()=> this.resetTimer() );
    window.addEventListener('keydown', ()=> this.resetTimer() );

    this.resetTimer();  // Timer starten das erste mal
  }

  resetTimer(){
    if(this.timer){  // wenn ein Timer schon gesetzt ist, wird er gelöscht
      clearTimeout(this.timer);
    }
  

  this.timer = setTimeout(()=>{
    this.autoLogout();
  }, this.idleTimeLimit);

}

autoLogout(){
  this.auth.signOut().then(() => {
    localStorage.removeItem('currentChannelID');
   localStorage.removeItem("currentChatID");
   localStorage.removeItem("currentUserID");
   localStorage.removeItem("directMessage");
   localStorage.removeItem("currentChatLength");
   localStorage.removeItem("threadMessage");
   localStorage.removeItem("currentChatUser");
   localStorage.removeItem("channelMessage");
   localStorage.removeItem("currentUserName");
  this.userService.setUserStatus(this.currentUser, false);
    this.route.navigateByUrl('/login');
    setTimeout(() => {
      location.reload();
    }, 2000);
   
  }).catch((error)=> {
    // console.log('ausloggen hat nicht geklappt...', error);
  });
}
}
