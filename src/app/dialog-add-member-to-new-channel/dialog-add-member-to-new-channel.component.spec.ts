import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddMemberToNewChannelComponent } from './dialog-add-member-to-new-channel.component';

describe('DialogAddMemberToNewChannelComponent', () => {
  let component: DialogAddMemberToNewChannelComponent;
  let fixture: ComponentFixture<DialogAddMemberToNewChannelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogAddMemberToNewChannelComponent]
    });
    fixture = TestBed.createComponent(DialogAddMemberToNewChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
