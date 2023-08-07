import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatNoMessageComponent } from './chat-no-message.component';

describe('ChatNoMessageComponent', () => {
  let component: ChatNoMessageComponent;
  let fixture: ComponentFixture<ChatNoMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatNoMessageComponent]
    });
    fixture = TestBed.createComponent(ChatNoMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
