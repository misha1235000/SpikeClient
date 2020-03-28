import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamAddPersonModalComponent } from './team-add-person-modal.component';

describe('TeamAddPersonModalComponent', () => {
  let component: TeamAddPersonModalComponent;
  let fixture: ComponentFixture<TeamAddPersonModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamAddPersonModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamAddPersonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
