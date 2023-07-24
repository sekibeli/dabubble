import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostheaderComponent } from './postheader.component';

describe('PostheaderComponent', () => {
  let component: PostheaderComponent;
  let fixture: ComponentFixture<PostheaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostheaderComponent]
    });
    fixture = TestBed.createComponent(PostheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
