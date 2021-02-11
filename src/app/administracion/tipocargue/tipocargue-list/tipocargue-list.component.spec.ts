import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipocargueListComponent } from './tipocargue-list.component';

describe('TipocargueListComponent', () => {
  let component: TipocargueListComponent;
  let fixture: ComponentFixture<TipocargueListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipocargueListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipocargueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
