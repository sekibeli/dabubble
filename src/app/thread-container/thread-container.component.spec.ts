import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadContainerComponent } from './thread-container.component';

describe('ThreadContainerComponent', () => {
  let component: ThreadContainerComponent;
  let fixture: ComponentFixture<ThreadContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThreadContainerComponent]
    });
    fixture = TestBed.createComponent(ThreadContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
