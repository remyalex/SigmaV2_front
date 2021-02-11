import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoDeleteComponent } from './formato-delete.component';

describe('FormatoDeleteComponent', () => {
  let component: FormatoDeleteComponent;
  let fixture: ComponentFixture<FormatoDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
