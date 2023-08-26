import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMessageInputComponent } from './new-message-input.component';

describe('NewMessageInputComponent', () => {
  let component: NewMessageInputComponent;
  let fixture: ComponentFixture<NewMessageInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewMessageInputComponent]
    });
    fixture = TestBed.createComponent(NewMessageInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
