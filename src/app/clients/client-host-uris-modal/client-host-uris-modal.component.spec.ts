import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientHostUrisModalComponent } from './client-host-uris-modal.component';

describe('ClientHostUrisModalComponent', () => {
  let component: ClientHostUrisModalComponent;
  let fixture: ComponentFixture<ClientHostUrisModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientHostUrisModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientHostUrisModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
