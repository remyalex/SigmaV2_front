import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipofallaListComponent } from './tipofalla-list.component';

describe('TipofallaListComponent', () => {
  let component: TipofallaListComponent;
  let fixture: ComponentFixture<TipofallaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipofallaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipofallaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
