import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigmaListComponent } from './sigma-list.component';

describe('SigmaListComponent', () => {
  let component: SigmaListComponent;
  let fixture: ComponentFixture<SigmaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigmaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigmaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
