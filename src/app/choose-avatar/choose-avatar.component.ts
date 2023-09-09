import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FileUploadService } from '../services/file-upload.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Subscription } from 'rxjs';
import { User } from '../models/user.class';

@Component({
  selector: 'app-choose-avatar',
  templateUrl: './choose-avatar.component.html',
  styleUrls: ['./choose-avatar.component.scss'],
  animations: [trigger('flyInAndOut', [
    state('in', style({ opacity: 1, transform: 'translateX(0)' })),
    state('out', style({ opacity: 0, transform: 'translateX(100%)' })),
    transition('out => in', [
      animate('500ms ease-in', style({ opacity: 1, transform: 'translateX(0)' })),
      animate('3s 1s'), // Bleibt 3 Sekunden in diesem Zustand
      animate('1s ease-out', style({ opacity: 0, transform: 'translateX(100%)' }))
    ]),
    transition('in => out', animate('1s ease-in-out')),
  ]),
]
   
})
export class ChooseAvatarComponent implements OnInit {
  isFlyingMessageVisible = false;
  avatarpic: boolean = true;
  url = '../../assets/img/profile_img/benutzer.png';
  currentPic = 'benutzer.png';
  newUserID:string;
  newUser:User;
  avatars = ['1.svg', '2.svg', '3.svg', '4.svg', '5.svg', '6.svg'];
  unsubscribeUser: Subscription;


  constructor(private userService: UserService, private route: Router, private fileUploadService: FileUploadService) {
    this.newUserID = localStorage.getItem('currentUserID');
  }


  ngOnInit(): void {
    this.unsubscribeUser = this.userService.getCurrentUser(this.newUserID).subscribe((value) => {
      this.newUser = <User>value;
    });
  }


  setNewPic(image) {
    this.currentPic = image;
  }


  saveNewPic(image: string) {
    this.userService.saveUserPic(this.newUserID, image, this.avatarpic);
   setTimeout(() => {
    this.route.navigateByUrl('login');
   }, 4000); 
  }


  onSelect(event) {
    this.avatarpic = false;
    const file: File = event.target.files[0]; // ausgewählte Datei wird gespeichert in Variable file
    let fileType = file.type;
    let fileSize = file.size;
    if (fileSize > 500 * 1024) {
      window.alert('Die Datei ist zu groß. Bitte senden Sie eine Datei, die kleiner als 500KB ist.');
      return; // Frühes Beenden der Funktion, wenn die Datei zu groß ist
    }
    if (fileType.match(/image\/(png|jpeg|jpg)/)) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
    
      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.setNewPic(this.url);
        };
    } else {
      window.alert('Bitte nur png, jpg oder jpeg senden');
    }
  }


  toggleFlyingMessage() {
    this.isFlyingMessageVisible = !this.isFlyingMessageVisible;
  }
}
