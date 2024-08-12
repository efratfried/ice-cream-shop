import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlavorCardComponent } from './flavor-card.component';

describe('FlavorComponent', () => {
  let component: FlavorCardComponent;
  let fixture: ComponentFixture<FlavorCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlavorCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlavorCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
