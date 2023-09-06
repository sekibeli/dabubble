import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogProfileComponent } from '../dialog-profile/dialog-profile.component';
import { DrawerService } from '../services/drawer.service';
import { SmilyService } from '../services/smily.service';
import * as pdfjsLib from 'pdfjs-dist';

@Component({
  selector: 'app-thread-detail',
  templateUrl: './thread-detail.component.html',
  styleUrls: ['./thread-detail.component.scss']
})
export class ThreadDetailComponent implements OnInit, OnDestroy, OnChanges {
author;
@Input() thread;
@Input() singlePost;
showPicker : boolean = false;

@ViewChild('pdfCanvasThread') pdfCanvasThread: ElementRef;
downloadUrl;
public pdfDataUrl: string;  // Der Base64-kodierte PDF-String
public isPDF: boolean = false;
time;
reactions;

currentChannelID;
currentUserID;

constructor(private userService: UserService, private dialog: MatDialog, private drawerService: DrawerService, private smilyService: SmilyService){
  this.currentChannelID = localStorage.getItem('currentChannelID');
this.currentUserID = localStorage.getItem("currentUserID");
}

ngOnInit(){
  
  if(this.thread && this.thread.author){
    this.getAuthorDetails(this.thread);
  }
    this.time =  new Date(this.thread['timestamp']).toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'});
    // console.log(this.trueFalse);
    // this.getFormatedDateFromTimestamp(this.thread['timestamp']);
    this.loadPDF();

if(!this.singlePost){
  // console.log('bin raus');
  return;
 
}



console.log('INIT singlePost:', this.singlePost['id']);

  // this.smilyService.getAllReactionsThread(localStorage.getItem('currentChannelID'), this.singlePost['id'], this.thread['id']).then((value) => {
  //   value.subscribe((reactions) => {
  //     console.log("reactions", reactions);
     
  //     this.reactions = reactions;
      
  //   });

  // });

  this.smilyService.getAllReactionsThread(localStorage.getItem('currentChannelID'), this.singlePost['id'], this.thread['id'])
.then((value) => {
  value.subscribe(
    (reactions) => { // Erfolgreiche Ausführung
      console.log("reactions", reactions);
      this.reactions = reactions;
    },
    (error) => { // Fehlerfall
      console.error('Problem beim Abonnieren');
    }
  );
})
.catch((error) => {
  console.log('Problem bei der Promised-basierten Operation');
});

  }
   
  ngOnChanges(changes: SimpleChanges): void {
    console.log('change', changes)
  }

  ngOnDestroy(): void {
    console.log('zerstört');
  }



getAuthorDetails(post){
  const userDataRef = this.userService.getCurrentUser(post['author']).subscribe((value)=>{
   
   
      this.author = value;
      
        
    });
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
    // const smily = `${event.emoji.native}`;
    const channel = localStorage.getItem('currentChannelID')
    console.log(event);
    console.log(channel);
    console.log(post);
    console.log(thread);
    console.log(localStorage.getItem("currentUserID"));
    this.smilyService.saveReactionThread(event, channel, post, thread, localStorage.getItem('currentUserID'));
    this.showPicker = false;

  }


  loadPDF() {
    this.pdfDataUrl = this.thread ? this.thread['file'] : '';  // Setze einen leeren String, wenn this.post oder this.post['file'] undefined ist
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
       
        return pdf.getPage(1);  // nur die erste Seite anzegen
      }).then(page => {

        if(this.pdfCanvasThread){
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

}
