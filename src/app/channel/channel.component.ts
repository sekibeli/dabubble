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

currentChannel(title, id, channel){
  console.log('title:', title);
  console.log('id:', id);
  this.channelService.pushActiveChannel(title, id, channel);
  
 }

 setMode(mode:boolean){
  localStorage.setItem('directMessage', JSON.stringify(mode));
  localStorage.setItem('channelMessage', JSON.stringify(!mode));
}

onProfileClick(event: Event) {
  this.drawerService.close();
  this.currentChannel(this.channel['title'], this.channel['id'], this.channel);
  this.setMode(false);

  if (window.innerWidth < 600) {
    this.drawerService.toggle();
    event.preventDefault();
   console.log('-1', this.drawerService.codeLearning$); 
    this.drawerService.setMyVariable(true)
    console.log('-2', this.drawerService.codeLearning$); 
    console.log('-3', this.drawerService.showCodeLearningLogo.value);
  }
}

}
