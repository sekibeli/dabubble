import { Component } from '@angular/core';
import { DrawerService } from '../services/drawer.service';

@Component({
  selector: 'app-thread-container',
  templateUrl: './thread-container.component.html',
  styleUrls: ['./thread-container.component.scss']
})
export class ThreadContainerComponent {

  constructor(private drawerService: DrawerService ){}

  closeThread(){
    this.drawerService.close();
  }


}
