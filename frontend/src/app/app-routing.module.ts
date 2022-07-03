import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductsComponent } from './components/products/products.component';
import { RegisterComponent } from './components/register/register.component';
import { ViewProductoComponent } from './components/view-producto/view-producto.component';

const routes: Routes = [
  { path: '', component: ProductsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'view-producto/:categoria', component: ViewProductoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
