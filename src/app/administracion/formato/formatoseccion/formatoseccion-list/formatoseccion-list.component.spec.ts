import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoseccionListComponent } from './formatoseccion-list.component';

describe('FormatoseccionListComponent', () => {
  let component: FormatoseccionListComponent;
  let fixture: ComponentFixture<FormatoseccionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoseccionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoseccionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
