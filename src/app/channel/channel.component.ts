import { Component, Input, OnInit } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { DrawerService } from '../services/drawer.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent  {
@Input() channel;
isActive: boolean = false;

constructor( private channelService: ChannelService, public drawerService: DrawerService){
 
}


// currentChannel(channel){
//   this.channelService.pushActiveChannel(channel);
 
  
//  }

 setMode(mode:boolean){
  localStorage.setItem('directMessage', JSON.stringify(mode));
  localStorage.setItem('channelMessage', JSON.stringify(!mode));
}

onProfileClick(event: Event) {
  this.isActive = !this.isActive;
  console.log('event:', event);
  this.drawerService.close();
// console.log(this.channel);
  // this.currentChannel(this.channel);
  this.channelService.pushActiveChannel(this.channel);
  localStorage.setItem('currentChannelID', this.channel['id']);

  this.setMode(false);

  if (window.innerWidth < 600) {
    this.drawerService.toggle();
    event.preventDefault();
  //  console.log('-1', this.drawerService.codeLearning$); 
    this.drawerService.setMyVariable(true)
    // console.log('-2', this.drawerService.codeLearning$); 
    // console.log('-3', this.drawerService.showCodeLearningLogo.value);
  }
}

}
