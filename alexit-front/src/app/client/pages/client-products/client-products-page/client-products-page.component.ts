import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../../models/product.model';
import { AlexitService } from '../../../../services/alexit.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductCardComponent } from './product-card/product-card.component';
import { CartService } from '../../../services/cart.service';
import { User } from '../../../../../models/user.model';
import { FiltersComponent } from './filters/filters.component';
import { Category } from '../../../../../models/category.model';
import { NgIf } from '@angular/common';
import { MobileFiltersComponent } from './mobile-filters/mobile-filters.component';
import { ConfiguratorService } from '../../../services/configurator.service';
import { Configurator } from '../../../../../models/configurator.model';
import { MyLibraryService } from '../../../../services/my-library.service';
import { ProductsHeaderComponent } from './products-header/products-header.component';
import { sorterValues } from '../../../../../constants/products-sorter';


@Component({
  selector: 'client-products-page',
  standalone: true,
  imports: [ProductCardComponent, FiltersComponent, NgIf, RouterLink, MobileFiltersComponent, ProductsHeaderComponent],
  templateUrl: './client-products-page.component.html',
  styleUrl: './client-products-page.component.css'
})
export class ClientProductsPageComponent implements OnInit {

  products: Product[] = [];

  user!: User;

  category!: Category;

  mobileFiltersActive: boolean = false;

  configuratorMode: boolean = false;

  configurator: Configurator = { name: "", playfield: [] };

  priceRange: { min: number, max: number } = { min: 0, max: 0 };

  rangeInput = { min: 0, max: 0 };

  initialSorterValue: string = "";

  initialOnDiscount: boolean = false;








  constructor(private alexit: AlexitService, private route: ActivatedRoute, private cartService: CartService,
    private router: Router, private cfg: ConfiguratorService, public $: MyLibraryService) { }
  ngOnInit(): void {
    this.configurator = this.cfg.getConfigurator();
    if (localStorage.getItem("customer_id")) {
      this.alexit.users$.subscribe(v => this.user = v.filter(u => u._id === String(localStorage.getItem("customer_id")))[0]);
    }
    if (this.route.snapshot.queryParams["configuratorMode"]) this.configuratorMode = true;
    this.route.params.subscribe(p => {
      this.alexit.categories$.subscribe(v => this.category = v.filter(ctg => ctg._id === p["categoryId"])[0]);
      this.alexit.products$.subscribe(v => {
        this.products = v.filter(prod => prod.category_id === p["categoryId"]);
        if (this.products.length > 0) {
          this.filtering();
          this.initPriceRange();
          this.priceFiltering();
          this.discountFiltering();
          this.sorting();
        }
      });
    });
  }









  initPriceRange() {
    this.rangeInput.min = Math.min.apply(Math, this.products.map(p => this.$.countDiscount(p.price.sale, p.price.discount.value)));
    this.priceRange.min = Math.min.apply(Math, this.products.map(p => this.$.countDiscount(p.price.sale, p.price.discount.value)));
    this.rangeInput.max = Math.max.apply(Math, this.products.map(p => this.$.countDiscount(p.price.sale, p.price.discount.value)));
    this.priceRange.max = Math.max.apply(Math, this.products.map(p => this.$.countDiscount(p.price.sale, p.price.discount.value)));
  }

  initProducts() {
    this.alexit.products$.subscribe(v => this.products = v.filter(p => p.category_id === this.route.snapshot.params["categoryId"]));
  }

  addToCart(e: { product_id: string }) {
    this.cartService.addToCart(e.product_id);
  }

  addToFavorites(e: { id: string }) {
    if (this.user) {
      if (!this.user.favoriteProducts.includes(e.id)) {
        this.user.favoriteProducts.push(e.id);
        this.alexit.updateUser(this.user);
      }
    }
  }

  addToConfigurator(e: { id: string, configuratorField: string }) {
    for (let component of this.configurator.playfield) {
      if (e.configuratorField === component.name) {
        component.product_id = e.id;
      }
    }
    this.cfg.setConfigurator(this.configurator);
    this.router.navigate(["configurator"]);
  }

  selectFilterOption(e: { key: string, value: string }) {
    let queryParams: any = {};
    queryParams[e.key] = e.value
    if (e.value === "") {
      const currentUrlTree = this.router.parseUrl(this.router.url);
      delete currentUrlTree.queryParams[e.key];
      this.router.navigateByUrl(currentUrlTree);
      this.initProducts();
    } else {
      this.initProducts();
      this.router.navigate([], { relativeTo: this.route, queryParams: queryParams, queryParamsHandling: "merge" });
    }
  }

  filtering() {
    this.route.queryParams.subscribe(q => {
      for (let i in this.category.specifications) {
        if (q[this.category.specifications[i].key]) {
          let specValuesArray: string[] = q[this.category.specifications[i].key].split(",");
          this.products = this.products.filter(p => specValuesArray.includes(p.specifications[i].value))
        }
      }
    })
  }

  filterProductsByPrice(e: { min: number, max: number }) {
    this.initProducts();
    this.router.navigate([], { relativeTo: this.route, queryParams: { priceMin: e.min, priceMax: e.max }, queryParamsHandling: "merge" });
  }

  priceFiltering() {
    this.route.queryParams.subscribe(q => {
      const min = q["priceMin"];
      const max = q["priceMax"];
      if (min && max) {
        this.products = this.products.filter(p => (this.$.countDiscount(p.price.sale, p.price.discount.value) >= min) && (this.$.countDiscount(p.price.sale, p.price.discount.value) <= max));
      }
    });
  }

  filterProductsByDiscount(e: { discount: string }) {
    let queryParams: any = {};
    queryParams["discount"] = e.discount;
    if (e.discount === "") {
      const currentUrlTree = this.router.parseUrl(this.router.url);
      delete currentUrlTree.queryParams["discount"];
      this.router.navigateByUrl(currentUrlTree);
      this.initProducts();
    } else {
      this.initProducts();
      this.router.navigate([], { relativeTo: this.route, queryParams: { discount: e.discount }, queryParamsHandling: "merge" });
    }
  }

  discountFiltering() {
    this.route.queryParams.subscribe(q => {
      if (q["discount"]) {
        this.initialOnDiscount = true;
        this.products = this.products.filter(p => p.price.discount.value > 0);
      }
    });
  }

  sortProducts(e: { sorterValue: string }) {
    this.initProducts();
    this.router.navigate([], { relativeTo: this.route, queryParams: { sorting: e.sorterValue }, queryParamsHandling: "merge" });
  }

  sorting() {
    this.route.queryParams.subscribe(q => {
      const sorterValue: string = q["sorting"];
      if (sorterValue) {
        this.initialSorterValue = sorterValue;
        switch (sorterValue) {
          case sorterValues.PRICE_ASCENDING:
            this.products = this.products.sort((a, b) => this.$.countDiscount(a.price.sale, a.price.discount.value) - this.$.countDiscount(b.price.sale, b.price.discount.value));
            break;
          case sorterValues.PRICE_DESCENDING:
            this.products = this.products.sort((a, b) => this.$.countDiscount(b.price.sale, b.price.discount.value) - this.$.countDiscount(a.price.sale, a.price.discount.value));
            break;
          case sorterValues.DATE_ASCENDING:
            this.products = this.products.sort((a, b) => new Date(a.creationDate).valueOf() - new Date(b.creationDate).valueOf());
            break;
          case sorterValues.DATE_DESCENDING:
            this.products = this.products.sort((a, b) => new Date(b.creationDate).valueOf() - new Date(a.creationDate).valueOf());
            break;
        }
      } else {
        this.router.navigate([], { relativeTo: this.route, queryParams: { sorting: sorterValues.DATE_DESCENDING }, queryParamsHandling: "merge" });
      }
    });
  }










}
