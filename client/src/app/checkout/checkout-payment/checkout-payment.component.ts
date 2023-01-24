import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { BasketSummaryComponent } from 'src/app/shared/components/basket-summary/basket-summary.component';
import { IBasket } from 'src/app/shared/models/basket';
import { IOrder } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm: FormGroup;
  constructor(private basketService: BasketService, private checkoutService: CheckoutService, private toastrService: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
  }

  submitOrder() {
    const basket = this.basketService.getCurrentBasketValue();
    const orderToCreate = this.getOrderToCreate(basket);

    this.checkoutService.createOrder(orderToCreate)
      .subscribe((order: IOrder) => {
        console.log("created order", order);
        this.toastrService.success("Order created successfully");
        this.basketService.deleteLocalBasket(basket.id);

        const navigationExtras: NavigationExtras = { state: order };

        this.router.navigate(["checkout/success"], navigationExtras);
      },
        (error) => {
          console.error(error);
          this.toastrService.error(error);
        })
  }
  private getOrderToCreate(basket: IBasket) {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkoutForm.get("deliveryForm").get("deliveryMethod").value,
      shipToAddress: this.checkoutForm.get("addressForm").value
    }
  }

}
