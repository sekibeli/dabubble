import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMessageHeaderComponent } from './new-message-header.component';

describe('NewMessageHeaderComponent', () => {
  let component: NewMessageHeaderComponent;
  let fixture: ComponentFixture<NewMessageHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewMessageHeaderComponent]
    });
    fixture = TestBed.createComponent(NewMessageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
