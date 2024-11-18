import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';


import { SignonformComponent } from '../app/login/signonform/signonform.component'; //'src/app/login/signonform/signonform.component';
import { SearchagencyComponent } from './verifications/searchagency/searchagency.component';
import {TranscriptComponent} from './reports/transcript/transcript.component';

const routes: Routes = [


  {path: 'login', component: SignonformComponent},
 // {path: 'login', component: HomeComponent},

    {path: '', redirectTo: 'login', pathMatch: 'full'},

    {path:'verAgency', component:SearchagencyComponent},
    {path:'transcript', component:TranscriptComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes,
     {onSameUrlNavigation: 'reload', enableTracing: true})
    ],
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


