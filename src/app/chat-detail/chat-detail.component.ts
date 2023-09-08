import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { DrawerService } from '../services/drawer.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';
import { SmilyService } from '../services/smily.service';
import { PostService } from '../services/post.service';
import { MessageService } from '../services/message.service';
import { DateService } from '../services/date.service';
import * as pdfjsLib from 'pdfjs-dist';
import { Post } from '../models/post.class';
import { User } from '../models/user.class';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss']
})
export class ChatDetailComponent implements OnInit, OnDestroy {
  @ViewChild('pdfCanvasMessage') pdfCanvasMessage: ElementRef;
  @Input() chat: Post;
  public pdfDataUrl: string;  // Der Base64-kodierte PDF-String
  public isPDF: boolean = false;
  messageAuthor: User;
  flip: boolean;
  showPicker: boolean = false;
  reactions: any[];
  currentUserID: string;
  dateMessageBefore: string = '';
  newDate: boolean;
  downloadUrl: string;
  unsubscribeUser: Subscription;
  unsubscribeReaction: Subscription;


  constructor(private userService: UserService, private drawerService: DrawerService, private dialog: MatDialog, private smilyService: SmilyService, public postService: PostService, public messageService: MessageService, private dateService: DateService) {
  }

  ngOnInit(): void {
    this.initializeCurrentUserID();
    this.initializeFlipStatus();
    this.initializeReactions();
    this.initializeDate();
    this.loadPDF();
  }


  initializeCurrentUserID(): void {
    this.currentUserID = localStorage.getItem('currentUserID');
    this.getDetailsFromID(this.chat['fromID']);
  }


  initializeFlipStatus(): void {
    if (this.chat) {
      const fromID = this.chat['fromID'];
      const userID = localStorage.getItem('currentUserID');
      this.flip = fromID === userID;

      if (this.chat['fromID'] === this.chat['toID'])
        this.flip = false;
    }
  }


  initializeReactions(): void {
    if (!(this.chat['id'] == '')) {
       this.smilyService.getAllReactionsMessage(this.chat['id']).then((value) => {
        this.unsubscribeReaction = value.subscribe((reactions) => {
          this.reactions = reactions;
        });
      });
    }
  }


  initializeDate(): void {
    const currentDate = this.dateService.getFormatedDateFromTimestamp(this.chat['timestamp']);
    this.newDate = currentDate !== this.dateService.getLastDate();

    if (this.newDate) {
      this.dateService.setLastDate(currentDate);
    }
  }


  getDetailsFromID(fromID: string) {
   this.unsubscribeUser =  this.userService.getCurrentUser(fromID).subscribe((user) => {
      this.messageAuthor = <User>user;
    });
  }

  openProfile(user: User) {
    const dialogConfig = new MatDialogConfig();

    if (this.drawerService.isSmallScreen) {
      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = '90vh';
    }

    dialogConfig.data = { user: user };
    const dialogRef = this.dialog.open(DialogProfileComponent, dialogConfig);
    dialogRef.componentInstance.user = user;
  }


  addReaction(event, message: string) {
    this.smilyService.saveReactionMessage(event, message['id'], localStorage.getItem('currentUserID'));
    this.showPicker = false;
  }


  loadPDF() {
    this.initializePDFData();

    if (this.isPDF) {
      this.renderPDF();
    }
  }


  initializePDFData() {
    this.pdfDataUrl = this.chat ? this.chat['file'] : '';
    if (this.pdfDataUrl && this.pdfDataUrl.startsWith('data:application/pdf')) {
      this.isPDF = true;
    }
  }


  renderPDF() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/assets/pdf.worker.min.js";

    // Laden und rendern des pdf
    const loadingTask = pdfjsLib.getDocument({ data: atob(this.pdfDataUrl.split('base64,')[1]) });

    loadingTask.promise.then(pdf => {
      return pdf.getPage(1);  // will Seite 1 anzeigen lassen
    }).then(page => {
      const viewport = page.getViewport({ scale: 1.0 });
      const canvas = this.pdfCanvasMessage.nativeElement;
      const context = canvas.getContext('2d');
      canvas.height = 200;
      const scale = 200 / viewport.height;
      const scaledViewport = page.getViewport({ scale });

      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport
      };
      page.render(renderContext);
    });
  }

  downloadPDF() {
    // PDF herunterladen
    const link = document.createElement('a');
    link.href = this.pdfDataUrl;
    link.download = 'document.pdf';
    link.click();
  }


  ngOnDestroy(): void {
    this.unsubscribeUser.unsubscribe();
    this.unsubscribeReaction.unsubscribe();
  }

}