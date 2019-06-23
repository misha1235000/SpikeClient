import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientHostUrisComponent } from './client-host-uris.component';

describe('ClientHostUrisComponent', () => {
  let component: ClientHostUrisComponent;
  let fixture: ComponentFixture<ClientHostUrisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientHostUrisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientHostUrisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
