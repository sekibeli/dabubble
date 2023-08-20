import { Component, Input, OnInit } from '@angular/core';
import { ChannelService } from '../services/channel.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
channelTitle: BehaviorSubject<String> = new BehaviorSubject<String>('');
  
constructor(private channelService: ChannelService){

}

ngOnInit(): void {
  // this.channelService.activeChannelTitle.subscribe((value)=>{
  //   if(this.channelTitle)
  //   this.channelTitle.next(value);
  // console.log(this.channelTitle.getValue());
  // });

  this.channelService.activeChannel.subscribe((value)=>{
    if(this.channelTitle)
    this.channelTitle.next(value['title']);
  console.log(this.channelTitle.getValue());
  });
  
}
}
