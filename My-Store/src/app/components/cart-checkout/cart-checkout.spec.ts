import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartCheckout } from './cart-checkout';

describe('CartCheckout', () => {
  let component: CartCheckout;
  let fixture: ComponentFixture<CartCheckout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartCheckout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartCheckout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
