import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../models/post.class';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../services/post.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PostContainerComponent } from '../post-container/post-container.component';
import { MessageService } from '../services/message.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.class';
import { ChannelService } from '../services/channel.service';

@Component({
  selector: 'app-input-thread',
  templateUrl: './input-thread.component.html',
  styleUrls: ['./input-thread.component.scss']
})
export class InputThreadComponent implements OnInit {
  @Input() singlePost;
  url;
  showEmojiPicker: boolean = false;
  chatLength: BehaviorSubject<number>;
  // @Input() user; // aus message der User an den die Message ist
  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  currentUser;
  currentChannel; // die ID
  channelTitle: BehaviorSubject<String> = new BehaviorSubject<String>('Angular');
  post: Post;
  directMessage; // sets if input is directMessage or not
  channelMessage;
  currentChatID;
  currentChatUser;
  currentChatLength;
  chatMessage: FormGroup = new FormGroup({
    description: new FormControl('', [Validators.required, Validators.minLength(2)]),
  })

  constructor(public postService: PostService, public activatedRoute: ActivatedRoute, public messageService: MessageService, private channelService: ChannelService) {
    const currentChatPartner = JSON.parse(localStorage.getItem('currentChatUser'))
    this.user.next(currentChatPartner);
    this.currentChatLength = (Number(localStorage.getItem('currentChatLength')));
    this.currentUser = localStorage.getItem('currentUserID');
    this.directMessage = JSON.parse(localStorage.getItem('directMessage'));
    this.channelMessage = JSON.parse(localStorage.getItem('channelMessage'));
     

  }

  ngOnInit() {
//     this.messageService.activeChatUser.subscribe((value)=>{
//       this.user.next(value) ;
//    })

//    this.messageService.chatLengthEmitter.subscribe((value)=>{
//  this.currentChatLength = value;
//    });

  //  this.channelService.displayedChannel.subscribe((value)=>{
  //   this.channelTitle.next(value['title']);
  //  });
    this.currentUser = localStorage.getItem('currentUserID');
    this.directMessage = JSON.parse(localStorage.getItem('directMessage'));
    this.channelMessage = JSON.parse(localStorage.getItem('channelMessage'));

    }

  savePost(description, postId) {
    // console.log('postDescription:', description);
    this.currentChannel = this.activatedRoute.snapshot.params['id'];
    let channelID = this.currentChannel;
    description = this.chatMessage.value.description;
    this.postService.savePost(this.currentUser, channelID, description, postId, this.url);
    this.chatMessage.reset();
    this.url = null;
    
  }

  saveMessage(description){
    description = this.chatMessage.value.description;
    // console.log('Message description:', description);
    this.messageService.saveMessage(description);
    this.chatMessage.reset();
    this.url = null;
  }


  onSelectDocument(event) {
    // this.avatarpic = false;
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
        this.url = event.target.result;
        console.log('thread nach dem Lesen:', this.url); // this.url ist ein Bild im Base64 Format
        // this.setNewPic(this.url);
       
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
}


