import { async, ComponentFixture, TestBed } from '@angular/core/testing';

describe('MiGestionListComponent', () => {
  let component: MiGestionListComponent;
  let fixture: ComponentFixture<MiGestionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiGestionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiGestionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
