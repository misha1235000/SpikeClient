import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamManagementModalComponent } from './team-management-modal.component';

describe('TeamManagementModalComponent', () => {
  let component: TeamManagementModalComponent;
  let fixture: ComponentFixture<TeamManagementModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamManagementModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamManagementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
