import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-thread-detail',
  templateUrl: './thread-detail.component.html',
  styleUrls: ['./thread-detail.component.scss']
})
export class ThreadDetailComponent {
author;
@Input() thread;


constructor(){
  
}
}
