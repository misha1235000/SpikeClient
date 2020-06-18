import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScopeManagementModalComponent } from './scope-management-modal.component';

describe('ScopeManagementModalComponent', () => {
  let component: ScopeManagementModalComponent;
  let fixture: ComponentFixture<ScopeManagementModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScopeManagementModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScopeManagementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
