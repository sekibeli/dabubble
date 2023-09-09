import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from '../models/user.class';
import { Post } from '../models/post.class';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../services/post.service';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from '../services/channel.service';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-input-post',
  templateUrl: './input-post.component.html',
  styleUrls: ['./input-post.component.scss']
})
export class InputPostComponent implements OnInit, OnDestroy {
  @ViewChild('textarea') textarea: ElementRef;
  showEmojiPicker = false;
  searchAt: boolean = false;
  messageContent;
  url;
  @Input() singlePost;
  chatLength: BehaviorSubject<number>;
  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  currentUser;
  currentChannelID: string; // die ID
  channelTitle: BehaviorSubject<String> = new BehaviorSubject<String>('');
  post: Post;
  directMessage; // sets if input is directMessage or not
  channelMessage;
  currentChatID;
  currentChatUser;
  currentChatLength;
  users;
  unsubscribeSortedUser: Subscription;
  chatMessage: FormGroup = new FormGroup({
    description: new FormControl('', [Validators.required, Validators.minLength(2)]),
  })

  constructor(public postService: PostService, public activatedRoute: ActivatedRoute, public channelService: ChannelService, private userService: UserService) {
    const currentChatPartner = JSON.parse(localStorage.getItem('currentChatUser'))
    this.user.next(currentChatPartner);
    this.currentChatLength = (Number(localStorage.getItem('currentChatLength')));


  }

  ngOnInit() {
    this.currentUser = localStorage.getItem('currentUserID');
    this.directMessage = JSON.parse(localStorage.getItem('directMessage'));
    this.channelMessage = JSON.parse(localStorage.getItem('channelMessage'));

    this.unsubscribeSortedUser = this.userService.getUserDataSorted().subscribe((users) => {
      this.users = users
    });
  }

  savePost(description, postId) {

    this.currentChannelID = this.activatedRoute.snapshot.params['id'];
    let channelID = this.currentChannelID;
    description = this.chatMessage.value.description;
    this.postService.savePost(this.currentUser, channelID, description, postId, this.url);

    this.chatMessage.reset();
    this.url = null;
  }

  toggleSearchAt() {
    this.searchAt = !this.searchAt;
  }


  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
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
        this.url = event.target.result; // this.url ist ein Bild im Base64 Format

      };
    } else {
      window.alert('Bitte nur png, jpg, jpeg oder PDF senden');
    }
  }


  isImage(url: string): boolean {
    return url.startsWith('data:image');
  }


  ngOnDestroy(): void {
    this.unsubscribeSortedUser.unsubscribe();
  }
} 
