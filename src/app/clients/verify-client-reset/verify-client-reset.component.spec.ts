import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyClientResetComponent } from './verify-client-reset.component';

describe('VerifyClientResetComponent', () => {
  let component: VerifyClientResetComponent;
  let fixture: ComponentFixture<VerifyClientResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyClientResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyClientResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
