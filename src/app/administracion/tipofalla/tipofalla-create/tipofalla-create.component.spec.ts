import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipofallaCreateComponent } from './tipofalla-create.component';

describe('TipofallaCreateComponent', () => {
  let component: TipofallaCreateComponent;
  let fixture: ComponentFixture<TipofallaCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipofallaCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipofallaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
