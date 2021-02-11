import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListasDetailComponent } from './listas-detail.component';

describe('ListasDetailComponent', () => {
  let component: ListasDetailComponent;
  let fixture: ComponentFixture<ListasDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListasDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListasDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
