import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyClientResetModalComponent } from './verify-client-reset-modal.component';

describe('VerifyClientResetModalComponent', () => {
  let component: VerifyClientResetModalComponent;
  let fixture: ComponentFixture<VerifyClientResetModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyClientResetModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyClientResetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
