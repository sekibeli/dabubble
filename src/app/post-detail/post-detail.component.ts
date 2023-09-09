import { Component, ElementRef, Input, OnInit, OnChanges, ViewChild, SimpleChanges } from '@angular/core';
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
import { first } from 'rxjs';
import * as pdfjsLib from 'pdfjs-dist';
import { DateService } from '../services/date.service';


@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
  
})
export class PostDetailComponent implements OnInit, OnChanges {
  @ViewChild('textarea') textarea;
  @Input() post;
  @ViewChild('pdfCanvas') pdfCanvas: ElementRef;
  downloadUrl;
  public pdfDataUrl: string;  // Der Base64-kodierte PDF-String
  public isPDF: boolean = false;
  showEmojiPicker: boolean = false;
  showPicker: boolean = false;
  showEditPost: boolean = false; // show the div "edit Post"
  showEditForm: boolean = false; // show the edit input field or not
  showPost: boolean = true; //shows the standard post-detail content
  editPost: boolean = false; // shows the input field to edit the post
 
  author;
  time;
  currentChannel;
  currentChannelID;
  numberOfThreads = 0;
  formatedDate;
  lastWeekday = '';
  einTag;
  newDay = true;
  countsOfThreads;
  flip: boolean;
  originalPost: Post;
  reactions;
  currentUserID: string;
  public hoveredReaction = null;
  usersArray;
  currentUserName;
  lastAnswer:string; // Uhrzeit der letzten Nachricht im Thread
  newDate;

  constructor(private userService: UserService,
    private drawerService: DrawerService,
    private threadService: ThreadService,
    private postService: PostService,
    private dialog: MatDialog,
    public channelService: ChannelService,
    private smilyService: SmilyService,
    private dateService: DateService) {

    this.currentUserID = localStorage.getItem('currentUserID');
this.currentChannelID = localStorage.getItem('currentChanneID');
  }

  ngOnInit() {
 
    this.currentChannel = this.channelService.currentChannelID.getValue();
    console.log('ngOnInit Post-detail', this.post);
    if (this.post) {

      if (this.post['author'] === localStorage.getItem('currentUserID')) {
        this.flip = true;
      } else {
        this.flip = false;
      }
    }
    this.getAuthorDetails(this.post);
    this.time = this.dateService.formatTime(this.post['timestamp']);
    this.getThread(this.postService.activeChannel, this.post.id);
    this.dateService.getFormatedDateFromTimestamp(this.post['timestamp']);


    this.smilyService.getAllReactions(this.currentChannel, this.post['id']).then((value) => {
      value.subscribe((reactions) => {
        console.log("reactions", reactions);
       
        this.reactions = reactions;
       
      });

    });

this.currentUserName = localStorage.getItem("currentUserName");


this.loadPDF();

const currentDate = this.dateService.getFormatedDateFromTimestamp(this.post['timestamp']);
    this.newDate = currentDate !== this.dateService.getLastDate();

    if (this.newDate) {
      this.dateService.setLastDate(currentDate);
    }
this.getLastAnswer(this.post['id']);
  }
activateTimer(){
  setTimeout(() => {
    this.showEditPost = false;
  }, 3000);
}

  /**
   * Abruf von author-Daten anhand des Posts
   */

ngOnChanges(changes: SimpleChanges): void {
  console.log('ngOnChanges', changes);
}
getLastAnswer(postID:string){
  this.threadService.getTimeFromLastAnswer(postID).subscribe((value)=> {
    if(value.length > 0){
      const lastAnswerTimestamp = value[value.length - 1]['timestamp'];
      this.lastAnswer = this.dateService.formatTime(lastAnswerTimestamp);
    }
  });
  
}


  getAuthorDetails(post) {
    const userDataRef = this.userService.getCurrentUser(post['author']).subscribe((value) => {

      this.author = value;

    });
  }


  getThread(channelID, postID) {
    this.threadService.getThread(channelID, postID).then((threads: any) => {
      this.numberOfThreads = threads.length;
      localStorage.setItem('directMessage', 'false');
    });

  }

  openProfile(user) {
    const dialogConfig = new MatDialogConfig();

    if (this.drawerService.isSmallScreen) {

      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = '90vh';
    }

    dialogConfig.data = { user: user };

    const dialogRef = this.dialog.open(DialogProfileComponent, dialogConfig);
    dialogRef.componentInstance.user = user;

  }


  checkIfItIsCurrentUserPost() {
    return this.post['author'] === localStorage.getItem('currentUserID');

  }

  editThisPost(post) {
    console.log('channelid', this.currentChannel);
    this.originalPost = JSON.parse(JSON.stringify(post));
    this.showEditForm = true;
    this.showPost = false;

  }

  updatePost() {
    if (this.post['description'].length > 2) {
      this.postService.updatePost(this.currentChannel, this.post['id'], this.post['description']);
      this.showEditForm = false;
      this.showPost = true;
    }
  }

  cancel() {
    Object.assign(this.post, this.originalPost);
    this.showEditForm = false;
    this.showPost = true;



  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  toggleReactionsPicker() {
    this.showPicker = !this.showPicker;
  }

  addEmoji(event) {
    const text = `${event.emoji.native}`;
    const textareaElem = this.textarea.nativeElement;
    const start = textareaElem.selectionStart;
    const end = textareaElem.selectionEnd;
    const before = textareaElem.value.substring(0, start);
    const after = textareaElem.value.substring(end);

    textareaElem.value = before + text + after;
    this.post['description'] = textareaElem.value;
    textareaElem.selectionStart = textareaElem.selectionEnd = start + text.length;


    this.showEmojiPicker = false;


  }

  addReaction(event, channel) {
    // const smily = `${event.emoji.native}`;
    console.log(event);
    console.log(channel['id']);
    console.log(this.post['id']);
    console.log(localStorage.getItem("currentUserID"));
    this.smilyService.saveReaction(event, channel['id'], this.post['id'], localStorage.getItem('currentUserID'));
    this.showPicker = false;

  }

  convertBase64ToFile() {
    let base64Data = this.post['file'];

    // Entfernen eines möglichen Daten-URI-Schemas
    const base64Header = 'base64,';
    const headerIndex = base64Data.indexOf(base64Header);
    if (headerIndex > -1) {
      base64Data = base64Data.substr(headerIndex + base64Header.length);
    }

    // Entfernen von Leerzeichen und Zeilenumbrüchen
    base64Data = base64Data.replace(/\s/g, '');

    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });
      this.downloadUrl = window.URL.createObjectURL(blob);
    } catch (e) {
      console.error('Fehler bei der Umwandlung von Base64 zu Blob:', e);
    }
  }

  loadPDF() {
    this.pdfDataUrl = this.post ? this.post['file'] : '';  // Setze einen leeren String, wenn this.post oder this.post['file'] undefined ist
    // this.pdfDataUrl = this.post['file'];
  
    if (this.pdfDataUrl && this.pdfDataUrl.startsWith('data:application/pdf')) {
      this.isPDF = true;
      console.log('isPDF', this.isPDF);
    }

    if (this.isPDF) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/assets/pdf.worker.min.js"
     
      // Laden und rendern des pdf
      const loadingTask = pdfjsLib.getDocument({ data: atob(this.pdfDataUrl.split('base64,')[1]) });

      loadingTask.promise.then(pdf => {
       
        return pdf.getPage(1);  // will Seite 1 anzeigen lassen
      }).then(page => {
        const viewport = page.getViewport({ scale: 1.0 });
        const canvas = this.pdfCanvas.nativeElement;
        const context = canvas.getContext('2d');
        canvas.height = 200;  // oder eine andere Höhe
        const scale = 200 / viewport.height;
        const scaledViewport = page.getViewport({ scale });

        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport
        };
        page.render(renderContext);
      });
    }
  }
    
    downloadPDF() {
    // PDF herunterladen
    const link = document.createElement('a');
    link.href = this.pdfDataUrl;
    link.download = 'document.pdf';
    link.click();
  }


}

