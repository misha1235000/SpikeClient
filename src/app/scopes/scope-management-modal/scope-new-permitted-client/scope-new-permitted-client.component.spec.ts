import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScopeNewPermittedClientComponent } from './scope-new-permitted-client.component';

describe('ScopeNewPermittedClientComponent', () => {
  let component: ScopeNewPermittedClientComponent;
  let fixture: ComponentFixture<ScopeNewPermittedClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScopeNewPermittedClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScopeNewPermittedClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
