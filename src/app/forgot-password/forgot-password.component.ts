import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
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
export class ForgotPasswordComponent {
  isFlyingMessageVisible: boolean = false;
  email;
  forgotPasswordForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  })

  constructor(private auth: AngularFireAuth, private route: Router) { }

  toggleFlyingMessage() {
    this.isFlyingMessageVisible = !this.isFlyingMessageVisible;
  }

  resetPassword() {
    const userEmail = this.forgotPasswordForm.get('email').value;
    this.auth.sendPasswordResetEmail(userEmail)
      .then(() => {
        console.log('Passwort-Zurücksetzungs-E-Mail wurde gesendet.');
      })
      .catch(error => {
        console.error('Fehler beim Senden der Passwort-Zurücksetzungs-E-Mail:', error);
      });
    setTimeout(() => {
      this.route.navigateByUrl('login');
    }, 4000);
  }
}
