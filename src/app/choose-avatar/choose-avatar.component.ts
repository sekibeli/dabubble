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
  // fileToUpload: File | null = null;
  url = '../../assets/img/profile_img/benutzer.png';
  currentPic = 'benutzer.png';
  newUserID;
  newUser;
  avatars = ['1.svg', '2.svg', '3.svg', '4.svg', '5.svg', '6.svg'];


  constructor(private userService: UserService, private route: Router, private fileUploadService: FileUploadService) {
    this.newUserID = localStorage.getItem('currentUserID');

  }

  ngOnInit(): void {
    this.userService.getCurrentUser(this.newUserID).subscribe((value) => {
      this.newUser = value;
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
   
    if (fileType.match(/image\/png/)) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
    
      reader.onload = (event: any) => {
        this.url = event.target.result;
        console.log('nach dem Lesen:', this.url); // this.url ist ein Bild im Base64 Format
        this.setNewPic(this.url);
        // let image =  new Image();
        // image.src = this.url;
       
      
        // this.fileUploadService.postFile(file).subscribe((response: any)=> {
        //   // URL speichern
        //   // console.log('response:', response);
        //   // console.log('url', response.imageUrl);
        //   this.saveNewPic(response.imageUrl);
        // }, error => {
        //   console.log('Fehler: ', error);
        // })
      };
    } else {
      window.alert('Bitte nur png senden');
    }
  }

  toggleFlyingMessage() {
    this.isFlyingMessageVisible = !this.isFlyingMessageVisible;
  }
}
