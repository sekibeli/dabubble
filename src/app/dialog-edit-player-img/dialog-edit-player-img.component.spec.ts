import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditPlayerImgComponent } from './dialog-edit-player-img.component';

describe('DialogEditPlayerImgComponent', () => {
  let component: DialogEditPlayerImgComponent;
  let fixture: ComponentFixture<DialogEditPlayerImgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogEditPlayerImgComponent]
    });
    fixture = TestBed.createComponent(DialogEditPlayerImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
