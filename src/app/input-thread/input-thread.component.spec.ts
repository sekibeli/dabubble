import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputThreadComponent } from './input-thread.component';

describe('InputThreadComponent', () => {
  let component: InputThreadComponent;
  let fixture: ComponentFixture<InputThreadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputThreadComponent]
    });
    fixture = TestBed.createComponent(InputThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
