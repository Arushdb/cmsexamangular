import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';



import { SignonformComponent } from 'src/app/login/signonform/signonform.component';







const routes: Routes = [


  {path: 'login', component: SignonformComponent},
 // {path: 'login', component: HomeComponent},

    {path: '', redirectTo: 'login', pathMatch: 'full'}


];


@NgModule({
  imports: [RouterModule.forRoot(routes,
     {onSameUrlNavigation: 'reload', enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(
    // private readonly router: Router,
  ) {
    // router.events
      // .subscribe(console.log);

  }
  }


