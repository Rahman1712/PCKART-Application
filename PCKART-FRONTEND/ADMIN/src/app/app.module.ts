import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { UsersComponent } from './users/users.component';
import { ProductService } from './_services/product.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './_services/auth.service';
import { TokenInterceptorService } from './_services/token-interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileComponent } from './profile/profile.component';
import { BrandsComponent } from './brands/brands.component';
import { CategoriesComponent } from './categories/categories.component';
import { AdminsComponent } from './admins/admins.component';
import { ProductViewComponent } from './products/product-view/product-view.component';
import { ProductAddComponent } from './products/product-add/product-add.component';
import { ProductUpdateComponent } from './products/product-update/product-update.component';
import { BrandAddComponent } from './brands/brand-add/brand-add.component';
import { BrandUpdateComponent } from './brands/brand-update/brand-update.component';
import { CategoryAddComponent } from './categories/category-add/category-add.component';
import { CategoryUpdateComponent } from './categories/category-update/category-update.component';
// import { authGuard } from './auth/auth.guard';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import { DragDirective } from './_directives/drag.directive';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FilterPipe } from './_pipes/filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrandfilterPipe } from './_pipes/brandfilter.pipe';
import { CategoryfilterPipe } from './_pipes/categoryfilter.pipe';
import { ProductfilterPipe } from './_pipes/productfilter.pipe';
import { OrderfilterPipe } from './_pipes/orderfilter.pipe';
import { UserfilterPipe } from './_pipes/userfilter.pipe';
import { AdminsfilterPipe } from './_pipes/adminsfilter.pipe';
import { ConfirmationDialogComponent } from './_utils/confirmation-dialog/confirmation-dialog.component';
import { AdminsUpdateComponent } from './admins/admins-update/admins-update.component';
import { AdminsAddComponent } from './admins/admins-add/admins-add.component';
import { BrandViewComponent } from './brands/brand-view/brand-view.component';
import { CategoryViewComponent } from './categories/category-view/category-view.component';
import { PasswordChangeModelComponent } from './_utils/password-change-model/password-change-model.component';
import { PictureModelComponent } from './_utils/picture-model/picture-model.component';
import { UserViewComponent } from './users/user-view/user-view.component';
import { DateFormatPipe } from './_pipes/date-format.pipe';
import { CouponsComponent } from './coupons/coupons.component';
import { CouponFilterPipe } from './_pipes/couponfilter.pipe';
import { CouponAddEditComponent } from './coupons/coupon-add-edit/coupon-add-edit.component';
import { OrderViewComponent } from './orders/order-view/order-view.component';
import { AlertBoxesComponent } from './_utils/alert-boxes/alert-boxes.component';
import { BannersComponent } from './banners/banners.component';
import { BannerAddEditComponent } from './banners/banner-add-edit/banner-add-edit.component';
import { LimitTextSizePipe } from './_pipes/limit-text-size.pipe';
import { StocksComponent } from './stocks/stocks.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ReportsComponent } from './reports/reports.component';
import { NotFoundComponent } from './error/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ProductsComponent,
    OrdersComponent,
    UsersComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    BrandsComponent,
    CategoriesComponent,
    AdminsComponent,
    ProductViewComponent,
    ProductAddComponent,
    ProductUpdateComponent,
    BrandAddComponent,
    BrandUpdateComponent,
    CategoryAddComponent,
    CategoryUpdateComponent,
    DragDirective,
    FilterPipe,
    BrandfilterPipe,
    CategoryfilterPipe,
    ProductfilterPipe,
    OrderfilterPipe,
    UserfilterPipe,
    AdminsfilterPipe,
    ConfirmationDialogComponent,
    AdminsUpdateComponent,
    AdminsAddComponent,
    BrandViewComponent,
    CategoryViewComponent,
    PasswordChangeModelComponent,
    PictureModelComponent,
    UserViewComponent,
    DateFormatPipe,
    CouponsComponent,
    CouponFilterPipe,
    CouponAddEditComponent,
    OrderViewComponent,
    AlertBoxesComponent,
    BannersComponent,
    BannerAddEditComponent,
    LimitTextSizePipe,
    StocksComponent,
    ReportsComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    DataTablesModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatExpansionModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    MatTabsModule,
    MatTooltipModule,
    MatDialogModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
    ImageCropperModule,
    MatTableModule,    
    NgxPaginationModule,
    MatPaginatorModule,
    MatListModule,
  ],
  providers: [
    ProductService,
    // AuthGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule { 
 

}
