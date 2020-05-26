import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WdsScaffoldingComponent } from './wds-scaffolding.component';

describe('WdsScaffoldingComponent', () => {
  let component: WdsScaffoldingComponent;
  let fixture: ComponentFixture<WdsScaffoldingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WdsScaffoldingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WdsScaffoldingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
