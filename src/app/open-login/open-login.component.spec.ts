import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenLoginComponent } from './open-login.component';

describe('OpenLoginComponent', () => {
  let component: OpenLoginComponent;
  let fixture: ComponentFixture<OpenLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
