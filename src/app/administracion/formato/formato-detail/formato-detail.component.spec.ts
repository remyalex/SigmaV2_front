import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoDetailComponent } from './formato-detail.component';

describe('FormatoDetailComponent', () => {
  let component: FormatoDetailComponent;
  let fixture: ComponentFixture<FormatoDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
