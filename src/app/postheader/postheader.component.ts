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
  // channelID ;
  // chan = 0;
  activeChannel = 'Angular';
constructor( public channelService: ChannelService){
 this.getChannels();
}

ngOnInit(){
this.channelService.activeChannel.subscribe(
  (value) => {
     this.activeChannel = value;
    console.log(this.activeChannel);
  }
)



}

getChannels(){
  this.channelService.getChannels().subscribe((value) => {
   
      this.channels = value;
      // console.log(this.channels[this.chan].title);  
    });

}


}
