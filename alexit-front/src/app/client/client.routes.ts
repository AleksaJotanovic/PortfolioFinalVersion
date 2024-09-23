import { Routes } from '@angular/router';
import { ClientComponent } from './client.component';
import { ClientMainComponent } from './components/client-main/client-main.component';
import { AccountComponent } from './pages/account/account.component';
import { ConfiguratorComponent } from './pages/configurator/configurator.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ClientProductsPageComponent } from './pages/client-products/client-products-page/client-products-page.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { PurchaseHistoryComponent } from './pages/account/account-details/purchase-history/purchase-history.component';
import { PreviouslyViewedComponent } from './pages/account/account-details/previously-viewed/previously-viewed.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { customerRegisteredGuard } from '../admin/guards/customer-registered.guard';
import { ConfirmNewsletterSubscriptionComponent } from '../admin/pages/confirm-newsletter-subscription/confirm-newsletter-subscription.component';
import { BlogsListComponent } from './pages/blogs/blogs-list/blogs-list.component';
import { BlogPageComponent } from './pages/blogs/blog-page/blog-page.component';
import { ClientOffersListComponent } from './pages/offers/client-offers-list/client-offers-list.component';
import { OfferPageComponent } from './pages/offers/offer-page/offer-page.component';
import { ClientResetPasswordComponent } from './pages/client-reset-password/client-reset-password.component';
import { ClientForgotPasswordComponent } from './pages/client-forgot-password/client-forgot-password.component';
import { EditAccountComponent } from './pages/account/account-details/edit-account/edit-account.component';
import { FavoriteProductsComponent } from './pages/account/account-details/favorite-products/favorite-products.component';
import { PersonalInfoComponent } from './pages/account/account-details/personal-info/personal-info.component';
import { ProductDetailsComponent } from './pages/client-products/client-products-page/product-details/product-details.component';
import { offerGuard } from './guards/offer.guard';
import { checkoutGuard } from './guards/checkout.guard';
import { newsletterSubscriptionGuard } from './guards/newsletter-subscription.guard';

export const clientRoutes: Routes = [
    {
        path: "", component: ClientComponent, children: [
            { path: "", component: ClientMainComponent },
            { path: "checkout", component: CheckoutComponent, canActivate: [checkoutGuard] },
            {
                path: "account", component: AccountComponent, canActivate: [customerRegisteredGuard], children: [
                    { path: "personal-info", component: PersonalInfoComponent },
                    { path: "edit-account", component: EditAccountComponent },
                    { path: "favorite-products", component: FavoriteProductsComponent },
                    { path: "purchase-history", component: PurchaseHistoryComponent },
                    { path: "previously-viewed", component: PreviouslyViewedComponent }
                ]
            },
            { path: "products/:categoryId/:categoryName", component: ClientProductsPageComponent },
            { path: "products/product/:productId/:productName", component: ProductDetailsComponent },
            { path: "configurator", component: ConfiguratorComponent },
            { path: "about-us", component: AboutUsComponent },
            { path: "contact", component: ContactComponent },
            { path: "blogs", component: BlogsListComponent },
            { path: "blogs/blog/:id/:blogTitle", component: BlogPageComponent },
            { path: "offers", component: ClientOffersListComponent },
            { path: "offers/offer/:id/:offerTitle", component: OfferPageComponent, canActivate: [offerGuard] }
        ]
    },
    { path: "confirm-newsletter-subscription/:token", component: ConfirmNewsletterSubscriptionComponent, canActivate: [newsletterSubscriptionGuard] },
    { path: "customer/forget-password", component: ClientForgotPasswordComponent },
    { path: "customer/reset/:token", component: ClientResetPasswordComponent }
];
