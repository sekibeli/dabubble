import { Component, Input } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { DrawerService } from '../services/drawer.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent {
@Input() channel;

constructor( private channelService: ChannelService, public drawerService: DrawerService){}

currentChannel(title, id){
  this.channelService.pushActiveChannel(title, id);
  
 }

 setMode(mode:boolean){
  localStorage.setItem('directMessage', JSON.stringify(mode));
  localStorage.setItem('channelMessage', JSON.stringify(!mode));
}
}
