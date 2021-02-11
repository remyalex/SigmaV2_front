import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrfeoDetailComponent } from './orfeo-detail.component';

describe('OrfeoDetailComponent', () => {
  let component: OrfeoDetailComponent;
  let fixture: ComponentFixture<OrfeoDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrfeoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrfeoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
