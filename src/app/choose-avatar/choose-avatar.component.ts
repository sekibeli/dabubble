import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-avatar',
  templateUrl: './choose-avatar.component.html',
  styleUrls: ['./choose-avatar.component.scss']
})
export class ChooseAvatarComponent implements OnInit{
  currentPic = 'benutzer.png';
  newUserID;
  newUser;
  avatars = ['1.svg','2.svg', '3.svg' ,'4.svg','5.svg','6.svg'];


  constructor(private userService: UserService, private route: Router){
  this.newUserID = localStorage.getItem('currentUserID');
   
  }

ngOnInit(): void {
 this.userService.getCurrentUser(this.newUserID).subscribe((value)=> {
  this.newUser = value;
 });
}

setNewPic(image){
  this.currentPic = image;
}

saveNewPic(image: string){
  this.userService.saveUserPic(this.newUserID, image);
  this.route.navigateByUrl('login');
}

}
