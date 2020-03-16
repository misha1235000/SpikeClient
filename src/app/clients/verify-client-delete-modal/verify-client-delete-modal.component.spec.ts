import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyClientDeleteModalComponent } from './verify-client-delete-modal.component';

describe('VerifyClientDeleteModalComponent', () => {
  let component: VerifyClientDeleteModalComponent;
  let fixture: ComponentFixture<VerifyClientDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyClientDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyClientDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
