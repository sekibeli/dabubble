import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Post } from '../models/post.class';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../services/post.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../services/message.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from '../models/user.class';
import { ChannelService } from '../services/channel.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit, OnDestroy {
  @ViewChild('textarea') textarea: ElementRef;
  @Input() singlePost;
  url;
  showEmojiPicker: boolean = false;
  chatLength: BehaviorSubject<number>;
  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  currentUserID: string;
  currentChannel: string; // die ID
  channelTitle: BehaviorSubject<String> = new BehaviorSubject<String>('Angular');
  post: Post;
  directMessage: boolean; // sets if input is directMessage or not
  channelMessage:boolean;
  currentChatID: string;
  currentChatUser:User;
  currentChatLength: number;
  users;
  searchAt: boolean = false;
  unsubscribeUserSorted: Subscription;
  unsubscribeChatUser:Subscription;
  unsubChatLength:Subscription;
  chatMessage: FormGroup = new FormGroup({
    description: new FormControl('', [Validators.required, Validators.minLength(2)]),
  })

  constructor(public postService: PostService, public activatedRoute: ActivatedRoute, public messageService: MessageService, private channelService: ChannelService, private userService: UserService) {
    const currentChatPartner = JSON.parse(localStorage.getItem('currentChatUser'))
    this.user.next(currentChatPartner);
    this.currentChatLength = (Number(localStorage.getItem('currentChatLength')));
    this.currentUserID = localStorage.getItem('currentUserID');
    this.directMessage = JSON.parse(localStorage.getItem('directMessage'));
    this.channelMessage = JSON.parse(localStorage.getItem('channelMessage'));
  }

  ngOnInit() {
   this.unsubscribeChatUser =  this.messageService.activeChatUser.subscribe((value) => {
      this.user.next(value);
    })

    this.unsubChatLength = this.messageService.chatLengthEmitter.subscribe((value) => {
      this.currentChatLength = value;
    });

    this.unsubscribeUserSorted = this.userService.getUserDataSorted().subscribe((users) => {
      this.users = users
    })
  }

  toggleSearchAt() {
       this.searchAt = !this.searchAt;
     }


  savePost(description, postId) {
    console.log('Ausgabe', description.value.description.length);
    this.currentChannel = this.activatedRoute.snapshot.params['id'];
    let channelID = this.currentChannel;
    description = this.chatMessage.value.description;
    this.postService.savePost(this.currentUserID, channelID, description, postId, this.url);
    this.chatMessage.reset();
  }


  saveMessage(description:string) {
  
    if(this.chatMessage.value.description.length > 1){
    description = this.chatMessage.value.description;
    if (this.url) {
      this.messageService.saveMessage(description, this.url);
    } else {
      this.messageService.saveMessage(description, null);
    }

    this.chatMessage.reset();
    this.url = null;
  }
  }


  onSelectDocument(event) {
    const file: File = event.target.files[0]; // ausgewählte Datei wird gespeichert in Variable file
    let fileType = file.type;
    let fileSize = file.size;
    if (fileSize > 500 * 1024) {
      window.alert('Die Datei ist zu groß. Bitte senden Sie eine Datei, die kleiner als 500KB ist.');
      return; // Frühes Beenden der Funktion, wenn die Datei zu groß ist
    }
    if (fileType.match(/image\/(png|jpeg|jpg)|application\/pdf/)) {
      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event: any) => {
        this.url = event.target.result;// this.url ist ein Bild im Base64 Format
      };
    } else {
      window.alert('Bitte nur png, jpg, jpeg oder PDF senden');
    }
  }


  isImage(url: string): boolean {
    return url.startsWith('data:image');
  }


  addEmoji(event) {
    const text = `${event.emoji.native}`;
    const currentText = this.chatMessage.get('description').value;
    const newText = currentText + text;
    this.chatMessage.get('description').setValue(newText);
    this.showEmojiPicker = false;
  }


  addAtUser(username: string) {
    const text = `@${username}`;
    const textareaElem = this.textarea.nativeElement;
    const start = textareaElem.selectionStart;
    const end = textareaElem.selectionEnd;
    const before = textareaElem.value.substring(0, start);
    const after = textareaElem.value.substring(end);
    const newValue = before + text + after;
    this.chatMessage.get('description').setValue(newValue);
    textareaElem.focus();
    textareaElem.selectionStart = textareaElem.selectionEnd = start + text.length;

    this.searchAt = false;
  }

  ngOnDestroy(): void {
    this.unsubscribeUserSorted.unsubscribe();
    this.unsubscribeChatUser.unsubscribe();
    this.unsubChatLength.unsubscribe();
  }
}
