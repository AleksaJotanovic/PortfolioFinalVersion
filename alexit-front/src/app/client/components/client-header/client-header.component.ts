import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Category } from '../../../../models/category.model';
import { AlexitService } from '../../../services/alexit.service';
import { NgClass, NgStyle } from '@angular/common';
import { PtIfPipe } from '../../../pipes/pt-if.pipe';
import { CustomerRegistrationComponent } from './customer-registration/customer-registration.component';
import { FormGroup, FormsModule } from '@angular/forms';
import { User } from '../../../../models/user.model';
import { v4 as uuid } from 'uuid';
import { AuthService } from '../../../admin/services/auth.service';
import { CartService } from '../../services/cart.service';
import { CrudService } from '../../../services/crud.service';
import { CookieService } from 'ngx-cookie-service';
import { roles } from '../../../../constants/roles';
import { CartComponent } from './cart/cart.component';
import { Courier } from '../../../../models/courier.model';
import { Product } from '../../../../models/product.model';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { Order } from '../../../../models/order.model';
import { MyLibraryService } from '../../../services/my-library.service';
import { QuantityExceededComponent } from './quantity-exceeded/quantity-exceeded.component';
import { orderStatusList } from '../../../../constants/order-status-list';


@Component({
  selector: 'client-header',
  standalone: true,
  imports: [RouterLink, NgStyle, PtIfPipe, CustomerRegistrationComponent, NgClass, CartComponent, SidemenuComponent, QuantityExceededComponent, FormsModule],
  templateUrl: './client-header.component.html',
  styleUrl: './client-header.component.css'
})
export class ClientHeaderComponent implements OnInit {

  categories: Category[] = [];

  subcategories: Category[] = [];

  user!: User;

  couriers: Courier[] = [];

  cart: { id: string, product_id: string, quantity: number }[] = [];

  totalPrice: number = 0;

  totalQuantity: number = 0;

  products: Product[] = [];

  searchedProducts: Product[] = [];

  searchFilter: string = "";

  @ViewChildren("productsSearch") productsSearch!: QueryList<ElementRef<HTMLDivElement>>

  formActive = { signup: false, signin: true };

  cartActive: boolean = false;

  sidemenuActive: boolean = false;

  loginError: boolean = false;

  quantityExceeded: boolean = false;

  categoriesMenu: boolean = false;

  subcategoriesMenu: boolean = false









  constructor(private alexit: AlexitService, private auth: AuthService,
    private cartService: CartService, private crud: CrudService, private cookies: CookieService, private router: Router, public $: MyLibraryService) { }
  ngOnInit(): void {
    this.alexit.categories$.subscribe({ next: v => this.categories = v });
    if (localStorage.getItem("customer_id") && this.cookies.get("customer_token")) {
      this.crud.userGet(String(localStorage.getItem("customer_id"))).subscribe(v => this.user = v.data);
    }
    this.alexit.products$.subscribe({ next: v => this.products = v, error: err => console.log(err) });
    this.alexit.couriers$.subscribe({ next: (val) => this.couriers = val, error: (err) => console.log(err) });
    this.cartService.totalPrice$.subscribe({ next: v => this.totalPrice = v });
    this.cartService.totalQuantity$.subscribe({ next: v => this.totalQuantity = v });
    this.cartService.cart$.subscribe({ next: v => this.cart = v });
    this.cartService.quantityExceeded.subscribe(v => { if (v) this.quantityExceeded = true; else this.quantityExceeded = false });
  }







  searchProducts() {
    this.alexit.products$.subscribe(v => this.searchedProducts = v);
    this.searchedProducts = this.searchedProducts.filter(x => (this.categoryName(x.category_id) + x.name + x.sku).toLowerCase().indexOf(this.searchFilter.toLowerCase()) >= 0);
    if (this.searchFilter === "") {
      this.searchedProducts = [];
      this.productsSearch.forEach(x => x.nativeElement.classList.remove("active"))
    }
    if (this.searchedProducts.length > 0) {
      this.productsSearch.forEach(x => x.nativeElement.classList.add("active"))
    } else {
      this.productsSearch.forEach(x => x.nativeElement.classList.remove("active"))
    }
  }

  categoryName(id: string): string {
    let categoryName: string = "";
    this.alexit.categories$.subscribe(v => categoryName = v.filter(x => x._id === id)[0].name);
    return categoryName;
  }


  goToProduct(product: Product) {
    this.searchFilter = "";
    this.searchedProducts = [];
    this.productsSearch.forEach(x => x.nativeElement.classList.remove("active"))
    this.router.navigate(["products/product", product._id, product.name]);
  }


  openSubcategories(parentId: string) {
    this.subcategories = this.categories.filter(c => c.parent_id === parentId);
    this.subcategoriesMenu = true;
  }

  goToProducts(category: Category) {
    this.categoriesMenu = false;
    this.subcategoriesMenu = false;
    if (!this.categoriesMenu && !this.subcategoriesMenu) {
      this.router.navigate(["products", category._id, category.name]);
    }
  }







  toggleProductsSidemenu(e: { productsSidemenu: HTMLDivElement, sidemenuGoback: HTMLSpanElement }) {
    e.productsSidemenu.classList.toggle('products-sidemenu-active');
    e.sidemenuGoback.classList.toggle('products-sidemenu-active');
  }

  toggleMobileSubcategories(e: { button: HTMLButtonElement, mobileSubcategories: HTMLDivElement }) {
    e.button.classList.toggle('subcategories-active');
    e.mobileSubcategories.classList.toggle('mobile-subcategories-active');
  }











  collapseAccountDropdown(accountDropdown: HTMLDivElement, registrationModal: HTMLDialogElement) {
    if (this.user !== undefined) {
      accountDropdown.classList.toggle('user-dropdown-active');
    } else {
      registrationModal.showModal();
    }
  }

  getCartProduct(product_id: string) {
    return this.products.filter(p => p._id === product_id)[0];
  }

  getMobileSubcategories(parent_id: string): Category[] {
    return this.categories.filter(c => c.parent_id === parent_id)
  }

  register(e: { registrationForm: FormGroup }) {
    const formValue = e.registrationForm.value as User;
    const customerBody: any = {
      role: roles.CUSTOMER,
      firstname: formValue.firstname,
      lastname: formValue.lastname,
      email: formValue.email,
      password: formValue.password,
      isAdmin: false,
      shippingAddress: {
        country: formValue.shippingAddress.country,
        city: formValue.shippingAddress.city,
        street: formValue.shippingAddress.street,
        zip: formValue.shippingAddress.zip,
        phone: formValue.shippingAddress.phone
      },
      creditCard: {
        number: "",
        expiryDate: "",
        cvv: ""
      },
      cart: [],
      favoriteProducts: [],
      purchaseHistory: [],
      previouslyViewed: []
    };
    this.alexit.addUser(customerBody);
    e.registrationForm.reset();
    this.formActive = { signin: true, signup: false };
  }

  login(e: { loginForm: FormGroup }, loginSuccess: HTMLDialogElement, registrationModal: HTMLDialogElement) {
    this.auth.customerLoginService(e.loginForm.value).subscribe({
      next: v => {
        this.loginError = false;
        if (!this.loginError) {
          registrationModal.close();
          loginSuccess.showModal();
          localStorage.setItem("customer_id", v.data._id);
          e.loginForm.reset();
          window.location.reload();
        }
      },
      error: e => { if (e) this.loginError = true },
    });
  }

  signout() {
    localStorage.removeItem("customer_id");
    this.cookies.delete("customer_token", "/");
    if (!localStorage.getItem("customer_id") && !this.cookies.get("customer_token")) {
      window.location.reload();
    }
  }

  incrementQuantity(e: { product: Product }) {
    this.cartService.addToCart(e.product._id);
    this.cart = this.cartService.getCart();
  }

  decrementQuantity(e: { item: any }) {
    this.cartService.decrementQuantity(e.item);
    this.cart = this.cartService.getCart();
  }

  removeCartItem(e: { id: string }) {
    this.cartService.removeItem(e.id);
    this.cartService.computeCartTotals();
  }

  goToCheckout() {
    let randomOrderNumber = Math.floor(Math.random() * 1000) + 1000;
    let orderItems: any[] = [];
    for (let item of this.cart) {
      if (this.getCartProduct(item.product_id)) {
        orderItems.push({
          product_id: this.getCartProduct(item.product_id)._id,
          image: this.getCartProduct(item.product_id).images[0],
          name: this.getCartProduct(item.product_id).name,
          price: this.getCartProduct(item.product_id).price.discount.value > 0 ?
            (this.$.subtractPercentage(this.getCartProduct(item.product_id).price.sale, this.getCartProduct(item.product_id).price.discount.value))
            : this.getCartProduct(item.product_id).price.sale,
          quantity: item.quantity,
          weight: this.getCartProduct(item.product_id).weight * item.quantity
        });
      }
    }

    const totalWeight = orderItems.reduce((prev: number, cur: any) => prev + cur.weight, 0);
    const totalPrice = orderItems.reduce((prev: number, cur: any) => prev + (cur.price * cur.quantity), 0);

    const order: Order = {
      _id: uuid(),
      number: String(randomOrderNumber),
      user: {
        firstname: this.user ? this.user.firstname : "",
        lastname: this.user ? this.user.lastname : "",
        email: this.user ? this.user.email : "",
        phone: this.user ? this.user.shippingAddress.phone : "",
        country: this.user ? this.user.shippingAddress.country : "",
        city: this.user ? this.user.shippingAddress.city : "",
        street: this.user ? this.user.shippingAddress.street : "",
        zip: this.user ? this.user.shippingAddress.zip : "",
        note: ""
      },
      courier_id: "",
      pcBuild: false,
      pcBuildName: "",
      status: orderStatusList.PLACED,
      paid: false,
      items: orderItems,
      weight: totalWeight,
      subtotal: totalPrice,
      shippingCost: 0,
      grandTotal: 0,
      creationTime: String(new Date()),
      accountingSent: false,
      saleGenerated: false
    };
    localStorage.setItem("order", JSON.stringify(order));
    this.router.navigate(["checkout"]);
    this.cartActive = false;
  }







}
