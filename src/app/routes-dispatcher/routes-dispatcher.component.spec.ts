import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesDispatcherComponent } from './routes-dispatcher.component';

describe('RoutesDispatcherComponent', () => {
  let component: RoutesDispatcherComponent;
  let fixture: ComponentFixture<RoutesDispatcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutesDispatcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutesDispatcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
