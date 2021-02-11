import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoseccioncampoListComponent } from './formatoseccioncampo-list.component';

describe('FormatoseccioncampoListComponent', () => {
  let component: FormatoseccioncampoListComponent;
  let fixture: ComponentFixture<FormatoseccioncampoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoseccioncampoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoseccioncampoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
