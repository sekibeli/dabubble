import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogShowChanneluserComponent } from './dialog-show-channeluser.component';

describe('DialogShowChanneluserComponent', () => {
  let component: DialogShowChanneluserComponent;
  let fixture: ComponentFixture<DialogShowChanneluserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogShowChanneluserComponent]
    });
    fixture = TestBed.createComponent(DialogShowChanneluserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
