import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { doc, onSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss']
})
export class ChatContainerComponent implements OnInit, OnDestroy {
  // currentUserID;
  subscription;
  id;
  chats;
  data1;
  ObservChats$;

  constructor(private messageService: MessageService, public activatedRoute: ActivatedRoute, public userService: UserService) {

  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params.subscribe(
      (params) => {
        this.id = params['id'];
        console.log('params:',params['id']);
        console.log('localStorage:', localStorage.getItem('currentUserID'));
        this.getThisChat(this.id);
      });
  }

  getThisChat(toID) {
    this.messageService.getThisChat(toID).then((value) => {
     
      value.subscribe((chats)=> {
        this.chats = chats;
        // this.chats.sort((a,b) =>{  // sortiert den Datensatz this.chats nach timestamp
        //         return a.timestamp - b.timestamp;
        //       })
        
      });
    
    //   const docRef1 = value.docRef1.subscribe((data1) => {
    //     this.data1 = data1;
    //   });
    //   const docRef2 = value.docRef2.subscribe((data2) => {
    //     this.chats = this.data1.concat(data2);
    //     this.chats.sort((a,b) =>{  // sortiert den Datensatz this.chats nach timestamp
    //       return a.timestamp - b.timestamp;
    //     })
    //   });
    //   return this.chats;
    // });
  });
}


// getThisChat(toID) {

// const messRef = this.messageService.getThisChat(toID);
//  messRef.then((data)=>{
 
//  })
//   this.messageService.getThisChat(toID).subscribe((value) => {
//     const unsub1 = onSnapshot(value.docRef1, (doc) => {
//       this.data1 = doc.data();
//     });

//     const unsub2 = onSnapshot(value.docRef2, (doc) => {
//       this.chats = this.data1.concat(doc.data());
//       this.chats.sort((a, b) => {
//         return a.timestamp - b.timestamp;
//       });
//     });

    
//   });
// }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



}
