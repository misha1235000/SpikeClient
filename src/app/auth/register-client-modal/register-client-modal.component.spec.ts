import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterClientModalComponent } from './register-client-modal.component';

describe('RegisterClientModalComponent', () => {
  let component: RegisterClientModalComponent;
  let fixture: ComponentFixture<RegisterClientModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterClientModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterClientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
