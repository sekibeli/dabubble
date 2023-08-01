import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../services/channel.service';

@Component({
  selector: 'app-postheader',
  templateUrl: './postheader.component.html',
  styleUrls: ['./postheader.component.scss']
})
export class PostheaderComponent implements OnInit {
  channels;
  channel;
  channelID;
constructor( public channelService: ChannelService){
 this.getChannels();
}

ngOnInit(){
 this.channelID = this.channelService.channelID;

}


getChannels(){
  this.channelService.getChannels().then((items) => {
    items.subscribe((value) => {
      this.channels = value;
      console.log(this.channels);
      console.log(this.channelService.channelID);
    });

  })
}
}
