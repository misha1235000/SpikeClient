import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewScopeModalComponent } from './new-scope-modal.component';

describe('NewScopeModalComponent', () => {
  let component: NewScopeModalComponent;
  let fixture: ComponentFixture<NewScopeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewScopeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewScopeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
