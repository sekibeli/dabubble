import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogShowChannelComponent } from './dialog-show-channel.component';

describe('DialogShowChannelComponent', () => {
  let component: DialogShowChannelComponent;
  let fixture: ComponentFixture<DialogShowChannelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogShowChannelComponent]
    });
    fixture = TestBed.createComponent(DialogShowChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
