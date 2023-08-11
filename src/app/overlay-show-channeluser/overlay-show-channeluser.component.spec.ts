import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayShowChanneluserComponent } from './overlay-show-channeluser.component';

describe('OverlayShowChanneluserComponent', () => {
  let component: OverlayShowChanneluserComponent;
  let fixture: ComponentFixture<OverlayShowChanneluserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OverlayShowChanneluserComponent]
    });
    fixture = TestBed.createComponent(OverlayShowChanneluserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
