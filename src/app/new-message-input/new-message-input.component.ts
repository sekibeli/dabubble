import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-message-input',
  templateUrl: './new-message-input.component.html',
  styleUrls: ['./new-message-input.component.scss']
})
export class NewMessageInputComponent {
  channelID;
  authorID;

  message: FormGroup = new FormGroup({
    description: new FormControl('', [Validators.required, Validators.minLength(2)]),
  })

  sendMessage(channelID, authorID, message){}
}
