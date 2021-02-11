import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrfeoListComponent } from './orfeo-list.component';

describe('OrfeoListComponent', () => {
  let component: OrfeoListComponent;
  let fixture: ComponentFixture<OrfeoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrfeoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrfeoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
