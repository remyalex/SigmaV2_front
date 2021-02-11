import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardUrlComponent } from './dashboard-url.component';

describe('DashboardUrlComponent', () => {
  let component: DashboardUrlComponent;
  let fixture: ComponentFixture<DashboardUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
