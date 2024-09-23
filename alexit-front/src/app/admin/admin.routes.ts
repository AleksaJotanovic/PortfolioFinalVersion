import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { OrderComponent } from './pages/orders/order/order.component';
import { LoginComponent } from './pages/login/login.component';
import { loginGuard } from './guards/login.guard';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { usersGuard } from './guards/users.guard';
import { SalesComponent } from './pages/sales/sales.component';
import { ProductsTableComponent } from './pages/products-table/products-table.component';
import { OrdersTableComponent } from './pages/orders/orders-table/orders-table.component';
import { UsersTableComponent } from './pages/users/users-table/users-table.component';
import { BlogEditorComponent } from './pages/blogs/blog-editor/blog-editor.component';
import { BlogsTableComponent } from './pages/blogs/blogs-table/blogs-table.component';
import { OfferEditorComponent } from './pages/offers/offer-editor/offer-editor.component';
import { salesGuard } from './guards/sales.guard';
import { CategoriesEditorComponent } from './pages/categories/categories-editor/categories-editor.component';
import { AdminForgotPasswordComponent } from './pages/admin-forgot-password/admin-forgot-password.component';
import { ProductEditorComponent } from './pages/products-table/product-editor/product-editor.component';
import { UserEditorComponent } from './pages/users/user-editor/user-editor.component';
import { OffersTableComponent } from './pages/offers/offers-table/offers-table.component';

export const adminRoutes: Routes = [
    {
        path: "admin", component: AdminComponent, canActivate: [loginGuard], children: [
            { path: "dashboard", component: DashboardComponent },
            { path: "products", component: ProductsTableComponent },
            { path: "products/edit-product/:categoryName/:id", component: ProductEditorComponent },
            { path: "products/add-product", component: ProductEditorComponent },
            { path: "categories", component: CategoriesComponent },
            { path: "categories/create-category", component: CategoriesEditorComponent },
            { path: "categories/category/:id", component: CategoriesEditorComponent },
            { path: "orders", component: OrdersTableComponent },
            { path: "orders/order/:id", component: OrderComponent },
            { path: "users", component: UsersTableComponent, canActivate: [usersGuard] },
            { path: "users/user/:id", component: UserEditorComponent },
            { path: "users/add-user", component: UserEditorComponent },
            { path: "sales", component: SalesComponent, canActivate: [usersGuard, salesGuard] },
            { path: "blogs", component: BlogsTableComponent },
            { path: "offers", component: OffersTableComponent }
        ]
    },
    { path: "admin/login", component: LoginComponent },
    { path: "admin/forget-password", component: AdminForgotPasswordComponent },
    { path: "admin/reset/:token", component: ResetPasswordComponent },
    { path: "admin/blogs/blog-editor", component: BlogEditorComponent },
    { path: "admin/blogs/blog-editor/:id", component: BlogEditorComponent },
    { path: "admin/offers/offer-editor", component: OfferEditorComponent },
    { path: "admin/offers/offer-editor/:id", component: OfferEditorComponent }
];
