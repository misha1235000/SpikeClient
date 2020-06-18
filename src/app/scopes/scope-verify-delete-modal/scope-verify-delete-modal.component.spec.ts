import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScopeVerifyDeleteModalComponent } from './scope-verify-delete-modal.component';

describe('ScopeVerifyDeleteModalComponent', () => {
  let component: ScopeVerifyDeleteModalComponent;
  let fixture: ComponentFixture<ScopeVerifyDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScopeVerifyDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScopeVerifyDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
