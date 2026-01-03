import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paintings } from './paintings';

describe('Paintings', () => {
  let component: Paintings;
  let fixture: ComponentFixture<Paintings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Paintings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Paintings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
