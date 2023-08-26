import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMessageContainerComponent } from './new-message-container.component';

describe('NewMessageContainerComponent', () => {
  let component: NewMessageContainerComponent;
  let fixture: ComponentFixture<NewMessageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewMessageContainerComponent]
    });
    fixture = TestBed.createComponent(NewMessageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
