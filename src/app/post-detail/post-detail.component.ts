import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.class';
import { DrawerService } from '../services/drawer.service';
import { MatDrawer } from '@angular/material/sidenav';
import { ThreadService } from '../services/thread.service';
import { PostService } from '../services/post.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';
import { Post } from '../models/post.class';
import { ChannelService } from '../services/channel.service';
import { SmilyService } from '../services/smily.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  @Input() post;
  showEmojiPicker: boolean = false;
  showPicker: boolean = false;
  showEditPost: boolean = false; // show the div "edit Post"
  showEditForm: boolean = false; // show the edit input field or not
  showPost: boolean = true; //shows the standard post-detail content
  editPost: boolean = false; // shows the input field to edit the post
  // @Input() timestamps;
  @Input() trueFalse:boolean;
  author;
  time;
  currentChannel;
  numberOfThreads = 0;
  formatedDate;
  lastWeekday = '';
  einTag;
  newDay = true;
  countsOfThreads;
  flip: boolean;
  originalPost: Post;
  reactions;
  constructor(private userService: UserService, 
    private drawerService: DrawerService, 
    private threadService: ThreadService, 
    private postService: PostService, 
    private dialog: MatDialog, 
    public channelService: ChannelService,
    private smilyService: SmilyService) {



  }

  ngOnInit() {
   this.currentChannel = this.channelService.currentChannelID.getValue();
   console.log('test', this.currentChannel);
    if (this.post){
      
if(this.post['author'] === localStorage.getItem('currentUserID')) {
  this.flip = true;
} else {
  this.flip = false;
}
    }
    this.getAuthorDetails(this.post);
    this.getTimeFromTimestamp(this.post['timestamp']);
       this.getThread(this.postService.activeChannel, this.post.id);
   this.getFormatedDateFromTimestamp(this.post['timestamp']);

  //  this.threadService.countsOfThreadsNew.subscribe((value)=>{
  //   this.countsOfThreads = value;
  //  })

  this.smilyService.getAllReactions(this.currentChannel, this.post['id']).then((value)=>{
    value.subscribe((reactions)=>{
      console.log("reactions", reactions);
    });
    
  });
  }

  /**
   * Abruf von author-Daten anhand des Posts
   */
  getAuthorDetails(post) {
    const userDataRef = this.userService.getCurrentUser(post['author']).subscribe((value) => {
     
        this.author = value;

      });
    }
  

  getTimeFromTimestamp(timestamp) {
    let date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    this.time = hours + ':' + minutes;

  }

  getThread(channelID, postID) {
    this.threadService.getThread(channelID, postID).then((threads: any) => {
      this.numberOfThreads = threads.length;
      localStorage.setItem('directMessage', 'false');
    });

  }

  getFormatedDateFromTimestamp(timestamp) {

    let date = new Date(timestamp);
     this.formatedDate = new Date(timestamp).toLocaleString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' });
     
  }

  openProfile(user){
    const dialogConfig = new MatDialogConfig();
    
    if (this.drawerService.isSmallScreen) {

      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = '90vh';
    }
  
    dialogConfig.data = { user: user};
   
    const dialogRef =  this.dialog.open(DialogProfileComponent, dialogConfig);
    dialogRef.componentInstance.user = user;
      
  }


  checkIfItIsCurrentUserPost(){
    return this.post['author'] === localStorage.getItem('currentUserID'); 
  
}

editThisPost(post){
  console.log('channelid', this.currentChannel);
  this.originalPost = JSON.parse(JSON.stringify(post));
  this.showEditForm = true;
  this.showPost = false;

}

updatePost(){
  if(this.post['description'].length > 2){
  this.postService.updatePost(this.currentChannel, this.post['id'], this.post['description']);
this.showEditForm = false;
  this.showPost = true;
  }
}

cancel(){
  Object.assign(this.post, this.originalPost);
  this.showEditForm = false;
  this.showPost = true;
 
  
 
}

toggleEmojiPicker() {
  this.showEmojiPicker = !this.showEmojiPicker;
}

toggleReactionsPicker(){
  this.showPicker = !this.showPicker;
}

addEmoji(event) {
  const text = `${event.emoji.native}`;
  const currentText = this.post['description'];
  console.log(currentText);
  const newText = currentText + text;

  this.post['description'] = newText;
  this.showEmojiPicker = false;
    
 
}

addReaction(event, channel){
  // const smily = `${event.emoji.native}`;
  console.log(event);
  console.log(channel['id']);
  console.log(this.post['id']);
  console.log(localStorage.getItem("currentUserID"));
  this.smilyService.saveReaction(event, channel['id'], this.post['id'], localStorage.getItem('currentUserID'));
  this.showPicker = false;

}


}

