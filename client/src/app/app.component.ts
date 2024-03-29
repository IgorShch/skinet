import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/account.service';
import { BasketService } from './basket/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'SkiNet';

  constructor(private basketService: BasketService,
    private accountService: AccountService) { }

  ngOnInit(): void {
    this.loadBasket();
    this.loadCurrentUser();
  }
  loadBasket() {
    const basketId = localStorage.getItem("basket_id");

    if (basketId) {
      this.basketService.getBasket(basketId)
        .subscribe(
          () => console.log("initialized basket"),
          (error) => console.error(error));
    }
  }

  loadCurrentUser() {
    this.accountService.loadCurrentUser()
      .subscribe(() => console.log("loaded user"), (error) => console.error(error))

  }
}
