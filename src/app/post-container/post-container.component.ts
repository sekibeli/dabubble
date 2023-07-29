import { Component, OnDestroy, OnInit} from '@angular/core';
import { PostService } from '../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-post-container',
  templateUrl: './post-container.component.html',
  styleUrls: ['./post-container.component.scss']
})
export class PostContainerComponent implements OnInit, OnDestroy {

  posts;
  id;
  subscription: Subscription;

  constructor(public postService: PostService, public route: Router, public activatedRoute: ActivatedRoute) {
    //  this.getPosts('9Gwz1Ce763caWx5FCBZL');

  }
/**
 * Funktion zur Beobachtung der URL, so dass die Inhalte gemäß der URL immer neu geladen werden.
 */
  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe(
      (params) => {
        this.id = params['id'];
        this.getPosts(this.id);
      });

  }

  /**
   * subscription muss manuell beseitigt werden, da sie nicht automatisch erlöscht. Ansonsten läuft der Speicher voll.
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  /**
   * 
   * @param id document ID 
   * Die Postings eines Channels werden abgerufen
   */
  async getPosts(id) {
    this.postService.getAllPosts(id).then((postings) => {
      postings.subscribe((posts) => {
        this.posts = posts;  
          
      })
    });

  }

  

}
