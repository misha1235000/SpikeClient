import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamJoinInfoModalComponent } from './team-join-info-modal.component';

describe('TeamJoinInfoModalComponent', () => {
  let component: TeamJoinInfoModalComponent;
  let fixture: ComponentFixture<TeamJoinInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamJoinInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamJoinInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
