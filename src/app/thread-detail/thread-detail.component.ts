import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';
import { DrawerService } from '../services/drawer.service';
import { SmilyService } from '../services/smily.service';
import * as pdfjsLib from 'pdfjs-dist';
import { ChannelService } from '../services/channel.service';
import { ThreadService } from '../services/thread.service';

@Component({
  selector: 'app-thread-detail',
  templateUrl: './thread-detail.component.html',
  styleUrls: ['./thread-detail.component.scss']
})
export class ThreadDetailComponent implements OnInit, OnDestroy, OnChanges {
  author;
  @ViewChild('textarea') textarea;
  @Input() thread;
 @Input() singlePost;
  onePost;
  aPost;
  showPicker: boolean = false;

  @ViewChild('pdfCanvasThread') pdfCanvasThread: ElementRef;
  downloadUrl;
  public pdfDataUrl: string;  // Der Base64-kodierte PDF-String
  public isPDF: boolean = false;
  time;
  reactions$;
  originalThread;
  currentChannelID;
  currentUserID;
  showEditForm: boolean = false;
  showPost: boolean = true;
  showEditThread: boolean = false;


  constructor(private userService: UserService, private dialog: MatDialog, private drawerService: DrawerService, private smilyService: SmilyService, private channelService: ChannelService, private threadService: ThreadService) {
    this.currentChannelID = localStorage.getItem('currentChannelID');
    this.currentUserID = localStorage.getItem("currentUserID");
   
    this.threadService.postForThread$.subscribe((post) => {
      // console.log(post);
      this.onePost = post;
    });


  }

  ngOnInit() {
    // console.log('thread-Detail erstellt');

    if (this.thread && this.thread.author) {
      // console.log(this.thread);
      this.getAuthorDetails(this.thread);
    }
    this.time = new Date(this.thread['timestamp']).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    this.loadPDF();

    this.smilyService.getAllReactionsThread(localStorage.getItem('currentChannelID'), this.onePost['id'], this.thread['id'])

      .then((value) => {
        value.subscribe(
          (reactions) => { // Erfolgreiche Ausführung
            // console.log("reactions", reactions);
            this.reactions$ = reactions;
          },
          (error) => { // Fehlerfall
            // console.error('Problem beim Abonnieren', error);
          }
        );
      })
      .catch((error) => {
        // console.log('Problem bei der Promised-basierten Operation', error);
      });
  
  
  
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('thread-Detail changes', changes);
    if (changes.thread && changes.thread.currentValue !== changes.thread.previousValue) {
      this.smilyService.getAllReactionsThread(localStorage.getItem('currentChannelID'), this.onePost['id'], this.thread['id'])

      .then((value) => {
        value.subscribe(
          (reactions) => { // Erfolgreiche Ausführung
            // console.log("reactions", reactions);
            this.reactions$ = reactions;
          },
          (error) => { // Fehlerfall
            // console.error('Problem beim Abonnieren', error);
          }
        );
      })
      .catch((error) => {
        // console.log('Problem bei der Promised-basierten Operation', error);
      });
      // Hier kannst du Code ausführen, wenn sich die 'thread'-Eingangsvariable ändert.
      this.thread = changes.thread.currentValue;

      if (this.thread && this.thread.author) {
        // console.log(this.thread);
        this.getAuthorDetails(this.thread);
      }
  
    }
  
  }
  ngOnDestroy(): void {
    // console.log('thread-detail zerstört');
  }

  activateTimer() {
    setTimeout(() => {
      this.showEditThread = false;
    }, 3000);
  }

  getAuthorDetails(thread) {
    // console.log('von post', thread);
    const userDataRef = this.userService.getCurrentUser(thread['author']).subscribe((value) => {
      this.author = value;
      // console.log('das hier ist thread-author', thread['description'], this.author);
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

  convertBase64ToFile() {
    let base64Data = this.thread['file'];

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

  addReaction(event, post, thread) {
     const channel = localStorage.getItem('currentChannelID')
    // console.log(event);
    // console.log(channel);
    // console.log(post);
    // console.log(thread);
    // console.log(localStorage.getItem("currentUserID"));
    this.smilyService.saveReactionThread(event, channel, post, thread, localStorage.getItem('currentUserID'));
    this.showPicker = false;

  }


  loadPDF() {
    this.pdfDataUrl = this.thread ? this.thread['file'] : '';  // Setze einen leeren String, wenn this.post oder this.post['file'] undefined ist
  
    if (this.pdfDataUrl && this.pdfDataUrl.startsWith('data:application/pdf')) {
      this.isPDF = true;
      // console.log('isPDF', this.isPDF);
    }

    if (this.isPDF) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/assets/pdf.worker.min.js"

      // Laden und rendern des pdf
      const loadingTask = pdfjsLib.getDocument({ data: atob(this.pdfDataUrl.split('base64,')[1]) });

      loadingTask.promise.then(pdf => {

        return pdf.getPage(1);  // nur die erste Seite anzegen
      }).then(page => {

        if (this.pdfCanvasThread) {
          const viewport = page.getViewport({ scale: 1.0 });
          // const canvas = this.pdfCanvasThread.nativeElement;
          const canvas = this.pdfCanvasThread ? this.pdfCanvasThread.nativeElement : null;

          const context = canvas.getContext('2d');

          const widthCanvas = 120;  //festgelegte Breite
          const scaleWidth = widthCanvas / viewport.width;

          canvas.height = 160;  // festgelegte Höhe
          canvas.width = widthCanvas;


          const scaledViewport = page.getViewport({ scale: scaleWidth });

          const renderContext = {
            canvasContext: context,
            viewport: scaledViewport
          };
          page.render(renderContext);
        };
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

  editThisThread(thread) {
    // console.log('channelid', this.channelService.currentChannelID.getValue());
    this.originalThread = JSON.parse(JSON.stringify(thread));
    this.showEditForm = true;
    this.showPost = false;

  }

  checkIfItIsCurrentUserPost() {
    return this.thread['author'] === localStorage.getItem('currentUserID');
  }

  updateThread() {
    if (this.thread['description'].length > 2) {
      this.threadService.updatePost(localStorage.getItem('currentChannelID'), this.singlePost['id'], this.thread['id'], this.thread['description']);
      this.showEditForm = false;
      this.showPost = true;
    }
  }

  cancel() {
    Object.assign(this.thread, this.originalThread);
    this.showEditForm = false;
    this.showPost = true;
  }
}
