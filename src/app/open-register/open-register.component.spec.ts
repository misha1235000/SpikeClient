import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenRegisterService } from './open-register.service';

describe('OpenLoginComponent', () => {
  let component: OpenRegisterService;
  let fixture: ComponentFixture<OpenRegisterService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenRegisterService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenRegisterService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
