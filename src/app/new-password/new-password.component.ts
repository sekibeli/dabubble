import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  hide = true;
  hideConfirmPassword = true;
  passwordForm: FormGroup = new FormGroup({
   
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', Validators.required)
  })

  oobCode: string;
  newPassword: string;

  constructor(private route: ActivatedRoute, private auth: AngularFireAuth, private router: Router) {}

  ngOnInit() {
    this.oobCode = this.route.snapshot.queryParamMap.get('oobCode');
    // Hier kannst du die notwendigen Schritte für die Passwortrücksetzung durchführen
  }


  saveNewPassword(){
    const newPassword = this.passwordForm.get('password').value;
    this.auth.confirmPasswordReset(this.oobCode, newPassword)
    .then(() => {
      // console.log('Passwort erfolgreich zurückgesetzt.');
    })
    .catch(error => {
      console.error('Fehler beim Zurücksetzen des Passworts:', error);
    });
    
      this.router.navigateByUrl('login');
    
}
  }
