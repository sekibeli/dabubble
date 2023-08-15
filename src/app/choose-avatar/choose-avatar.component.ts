import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FileUploadService } from '../services/file-upload.service';

@Component({
  selector: 'app-choose-avatar',
  templateUrl: './choose-avatar.component.html',
  styleUrls: ['./choose-avatar.component.scss']
})
export class ChooseAvatarComponent implements OnInit {
  // fileToUpload: File | null = null;
  url = 'https://img.icons8.com/?size=150&id=492ILERveW8G&format=png';
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
    this.userService.saveUserPic(this.newUserID, image);
    this.route.navigateByUrl('login');
  }


  onSelect(event) {
    const file: File = event.target.files[0]; // ausgewählte Datei wird gespeichert in Variable file
    let fileType = file.type;
   
    if (fileType.match(/image\/png/)) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.url = event.target.result;
       
      
        this.fileUploadService.postFile(file).subscribe((response: any)=> {
          // URL speichern
          this.saveNewPic(response.imageUrl);
        }, error => {
          console.log(error);
        })
      };
    } else {
      window.alert('Bitte nur png senden');
    }
  }
}
