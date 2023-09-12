import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { DocumentData, Firestore, collection, endAt, getDocs, limit, orderBy, query, startAt } from '@angular/fire/firestore';
import { User } from '../models/user.class';
import { Subject, combineLatest } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';
import { DrawerService } from '../services/drawer.service';
import { DialogShowChannelComponent } from '../dialog-show-channel/dialog-show-channel.component';
import { ChannelService } from '../services/channel.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../services/post.service';
import { Router } from '@angular/router';
import { MessageService } from '../services/message.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-new-message-container',
  templateUrl: './new-message-container.component.html',
  styleUrls: ['./new-message-container.component.scss']
})
export class NewMessageContainerComponent implements OnInit {
@ViewChild('textarea') textarea : ElementRef;
  firestore: Firestore = inject(Firestore);
searchterm: string;
startAt = new Subject();
endAt = new Subject();
startobs = this.startAt.asObservable();
endobs = this.endAt.asObservable();
notChosen = true;
chosenUser;
search = false;
users;
result;
isSmallScreen;
currentUser;
isChannel: boolean; //is the chosen item a channel?
channelID;
authorID;
url;
userSorted;
isActive: boolean; // Link left sideMenu is activated
chosenItem: any; // the object of the chosen item, user or channel
postID;
showEmojiPicker: boolean = false;
searchAt:boolean = false;

message: FormGroup = new FormGroup({
  description: new FormControl('', [Validators.required, Validators.minLength(2)]),
})


constructor(public dialog: MatDialog, private drawerService: DrawerService, private channelService: ChannelService, private postService: PostService, private route: Router, private messageService: MessageService, private userService: UserService){}
ngOnInit() {
  this.isSmallScreen = this.drawerService.isSmallScreen;
  // console.log('für mobil:', this.drawerService.isSmallScreen);
  this.currentUser = localStorage.getItem("currentuserID");
  // combineLatest([this.startobs, this.endobs]).subscribe((value)=> {
  //   this.searchUserInFirestore(value[0], value[1]).then((user)=>{
  //     this.users = user.docs.map(doc => doc.data());
  //   })
  //   console.log(this.users);
  // })
  combineLatest([this.startobs, this.endobs]).subscribe((value)=> {
    this.searchInFirestore(value[0], value[1]).then((items)=>{
      this.users = items;
      // console.log(items);
      this.result = this.separateUsersAndChannels(items);
      // console.log('USER',this.result.users);
      // console.log('CHANNEL',this.result.channels, this.result.channels.length);
    })
    .catch(error => {
      // console.error("Error fetching data: ", error);
    });
  })
  this.userService.getUserDataSorted().subscribe((users)=> {
    this.userSorted = users
    // console.log(this.userSorted);
   
  })
  // console.log(this.result.users);   
  // console.log(this.result.channels);
}

searchMember($event) {
  this.resetSearchState($event);
  this.search = true;
  let q = $event.target.value;

  if (q.startsWith('@')) {
    q = q.substring(1);
    // console.log('beginnt mit @', q);
    this.searchInUserCollection(q);
  } else if (q.startsWith('#')){
    q = q.substring(1);
    this.searchInChannelsCollection(q)
  } else
  this.startAt.next(q);
  this.endAt.next(q + "\uf8ff");
}

toggleSearchAt(){
  // console.log(this.searchAt);
  this.searchAt = !this.searchAt;
  // console.log(this.searchAt);
}

resetSearchState($event){
  this.search = false;
  this.users = []; 
  this.result = { users: [], channels: [] }; 
  let q = $event.target.value;
}


  chooseNewMember(user:User){
    this.chosenUser = user;
    // console.log(user);
    this.notChosen = false;
    this.chosenUser = user;
  }

  async searchInUserCollection(q) {
    // Suche in der 'users' Collection
    const usersCollRef = collection(this.firestore, 'users');
    const usersQueryRef = query(usersCollRef, orderBy('username'), limit(30), startAt(q), endAt(q + "\uf8ff"));  //  orderBy('username'),
    const usersDocRef = await getDocs(usersQueryRef);

    const users = usersDocRef.docs.map(doc => doc.data());
  // Setzen Sie 'this.users' und 'this.result' entsprechend
  this.users = users;
  this.result = { users, channels: [] };

  }

  async searchInChannelsCollection(q){
    const channelsCollRef = collection(this.firestore, 'channels');
    const channelsQueryRef = query(channelsCollRef, orderBy('title'), limit(30), startAt(q), endAt(q + "\uf8ff")); //  orderBy('title'),
    const channelsDocRef = await getDocs(channelsQueryRef);

    const channels = channelsDocRef.docs.map(doc => {
      const channelData = doc.data() as DocumentData;
      return { id: doc.id, ...channelData };
    });
  
    this.users = channels;
  this.result = { users: [], channels };
  }

  async searchInFirestore(start, end) {
    // Suche in der 'users' Collection
    const usersCollRef = collection(this.firestore, 'users');
    const usersQueryRef = query(usersCollRef, orderBy('username'),limit(10), startAt(start), endAt(end));  //  orderBy('username'),
     const usersDocRef = await getDocs(usersQueryRef);
    
    // Suche in der 'channels' Collection
    const channelsCollRef = collection(this.firestore, 'channels');
    const channelsQueryRef = query(channelsCollRef, orderBy('title'), limit(10), startAt(start), endAt(end)); //  orderBy('title'),
    const channelsDocRef = await getDocs(channelsQueryRef);
    
  
    // Kombiniere die Ergebnisse der beiden Queries
    const combinedResults = [];
    usersDocRef.forEach(doc => {
      combinedResults.push(doc.data());
    });
    
    channelsDocRef.forEach(doc => {
      // combinedResults.push(doc.data());
      const channelData = doc.data() as DocumentData;
      const channelWithId = { id: doc.id, ...channelData }; // Hier fügen Sie die ID zum Dokument hinzu
      combinedResults.push(channelWithId);
    });
  
    return combinedResults;
  }

separateUsersAndChannels(jsonArray) {
  // console.log(jsonArray);
    // Filtert die JSON-Objekte, die ein 'username'-Feld haben, und schiebt sie in das 'users'-Array
    const users = jsonArray.filter((jsonObject) => 'username' in jsonObject);
  
    // Filtert die JSON-Objekte, die ein 'title'-Feld haben, und schiebt sie in das 'channels'-Array
    const channels = jsonArray.filter((jsonObject) => 'title' in jsonObject);
  
    // Gibt ein Objekt zurück, das die beiden separaten Arrays enthält
    return { users, channels };
  }
  

  openProfile(user){
    const dialogConfig = new MatDialogConfig();
    if (this.drawerService.isSmallScreen) {

      // dialogConfig.width = '95vw';
      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = '90vh';
      

    }

    dialogConfig.data = { user: user };
    const dialogRef = this.dialog.open(DialogProfileComponent, dialogConfig);
    dialogRef.componentInstance.user = user;
  }

  showChannel(channel){
   
    this.openShowChannelInformation(channel)
  }


  openShowChannelInformation(channel) {
    // this.changeDetect.detectChanges();
    // this.checkScreenSize();
    // console.log(channel);
    // console.log(this.drawerService.isSmallScreen);
    const dialogConfig = new MatDialogConfig();
    if (this.drawerService.isSmallScreen) {

      dialogConfig.width = '100vw';
      dialogConfig.maxWidth = '100vw';
      dialogConfig.height = '100vh';
      

    }
    // console.log('small:', this.isSmallScreen);
    dialogConfig.data = {
      currentChannelData: channel, 
      isSmallScreen: this.drawerService.isSmallScreen,

      // members: this.members
    };
    this.dialog.open(DialogShowChannelComponent, dialogConfig);

  }

  chooseUser(user){
    this.chosenItem = user;
    this.isChannel = false;
    this.searchterm = user['username'];
  this.search = false;
  }

  chooseChannel(channel){
    this.chosenItem = channel;
    this.isChannel = true;
    // console.log(channel);
    if(channel['members'].includes(localStorage.getItem('currentUserID'))){
      this.searchterm = channel['title'];
      this.search = false;
    } else {
      // console.log('ERst Channel beitreten');
      this.openShowChannelInformation(channel);
    }
   
   }

   sendMessage(message){
    // if (this.url = '') this.url = null;
    if(this.isChannel){
      
      // let channelID = this.currentChannel;
      let description = this.message.value.description;
      // console.log(description);
      this.postService.savePost(this.currentUser, this.chosenItem['id'], description, this.postID, this.url);
      // this.channelService.pushActiveChannel(this.chosenItem);
      const url = "/home/channel/" + this.chosenItem['id'];
      this.route.navigateByUrl(url);
      this.channelService.pushActiveChannel(this.chosenItem);
      // this.message.reset();
    } else {
      this.onProfileClick();
      let description = this.message.value.description;
      this.messageService.saveMessage(description, this.url);
      const url = "/home/chat/" + this.chosenItem['id'];
      this.route.navigateByUrl(url);
     
    }
   }

   onProfileClick(){
    this.isActive = true;
    this.messageService.getThisChat(this.chosenItem['id']);
    // this.setMode(true); 
    this.drawerService.close(); 
    this.messageService.setChatUser(this.chosenItem['id']); 
    this.messageService.pushChatUser(this.chosenItem); 
    this.messageService.getChatLength(this.chosenItem['id'])

    if (window.innerWidth < 650) {
      // this.drawerService.toggle();
      event.preventDefault();
    
      // this.drawerService.setMyVariable(true)
 
    }
  }
  addEmoji(event) {
    const text = `${event.emoji.native}`;
  const currentText = this.message.get('description').value;
  const newText = currentText + text;

  this.message.get('description').setValue(newText);
  this.showEmojiPicker = false;
    
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
        // console.log('nach dem Lesen:', this.url); // this.url ist ein Bild im Base64 Format
        // this.setNewPic(this.url);
       
      };
    } else {
      window.alert('Bitte nur png, jpg, jpeg oder PDF senden');
    }
  }
 
  isImage(url: string): boolean {
    return url.startsWith('data:image');
  }
  addAtUser(username:string) {
    const text = `@${username}`;
    const textareaElem = this.textarea.nativeElement;
    const start = textareaElem.selectionStart;
    const end = textareaElem.selectionEnd;
    const before = textareaElem.value.substring(0, start);
    const after = textareaElem.value.substring(end);

    const newValue = before + text + after;
    this.message.get('description').setValue(newValue);
    textareaElem.focus();
    textareaElem.selectionStart = textareaElem.selectionEnd = start + text.length;


    this.searchAt = false;


  }
 
 }






