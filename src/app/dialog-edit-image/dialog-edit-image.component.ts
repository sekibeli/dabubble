import { Component } from '@angular/core';
import { User } from '../models/user.class';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-image',
  templateUrl: './dialog-edit-image.component.html',
  styleUrls: ['./dialog-edit-image.component.scss']
})
export class DialogEditImageComponent {
user:User;
isFlyingMessageVisible = false;
avatarpic: boolean = true;
// fileToUpload: File | null = null;
url = '../../assets/img/profile_img/benutzer.png';
currentPic = 'benutzer.png';
newUserID;
newUser;
avatars = ['1.svg', '2.svg', '3.svg', '4.svg', '5.svg', '6.svg'];

constructor(private userService:UserService, public dialogRef: MatDialogRef<DialogEditImageComponent>){}

setNewPic(image) {
  this.currentPic = image;
}

saveNewPic(image: string) {
  this.userService.saveUserPic(this.user['id'], image, this.avatarpic);
  this.dialogRef.close()


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
      console.log('nach dem Lesen:', this.url); // this.url ist ein Bild im Base64 Format
      this.setNewPic(this.url);
     
    };
  } else {
    window.alert('Bitte nur png, jpg oder jpeg senden');
  }
}


}
