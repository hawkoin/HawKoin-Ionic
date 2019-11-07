import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'admin', loadChildren: './admin/admin.module#AdminPageModule' },
  { path: 'receipt', loadChildren: './receipt/receipt.module#ReceiptPageModule' },
  { path: 'student', loadChildren: './student/student.module#StudentPageModule' },
  { path: 'vendor', loadChildren: './vendor/vendor.module#VendorPageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
