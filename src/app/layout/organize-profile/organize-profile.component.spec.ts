import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizeProfileComponent } from './organize-profile.component';

describe('OrganizeProfileComponent', () => {
  let component: OrganizeProfileComponent;
  let fixture: ComponentFixture<OrganizeProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizeProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
