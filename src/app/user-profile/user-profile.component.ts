import { Component, Input, OnInit } from '@angular/core';
import { User } from '../models/user.class';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit{
  @Input()  userLoggedIn_UID;
  @Input() currentUser;
  user: User;

  constructor() {
   
  }

  ngOnInit(): void {
  // console.log(this.currentUser);
   
  }

}


