import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';


import { UserService } from 'src/app/services/user.service';
import { HttpParams } from '@angular/common/http';

// import { AuthService } from '../services/auth.service'
import { AuthService } from 'src/app/services/auth.service';

import { isUndefined } from 'typescript-collections/dist/lib/util';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import { environment } from 'src/environments/environment';

import { MatDialog } from '@angular/material/dialog';

import { MyItem } from 'src/app/interfaces/my-item';

import { NgForm } from '@angular/forms';


import { LoginService } from '../../services/login.service';


@Component({

selector: 'signonform',
	templateUrl: './signonform.component.html',
	styleUrls: ['./signonform.component.css']
})
export class SignonformComponent implements OnDestroy {
	@ViewChild('form') public userFrm: NgForm;
	constructor(
		private loginservice: LoginService,
		private router:Router,
		private elementRef: ElementRef,
		public dialog: MatDialog

	) 
	{
		

		if (environment.production) {
			this.env = true;
		}
		else {
			this.env = false;
		}


	}

	

	public sts = 'ACT';
	message = '';
	returnUrl: string;

	
	token: any;
	public combodata: MyItem[] = [];
	subs = new SubscriptionContainer();
	
	login_params: HttpParams;
	userid = '';
	env = false;
	combolabel: string;
	combowidth: string;

	optionselected = false;




	ngOnInit() {

   this.login_params= new HttpParams();
		this.returnUrl = '/dashboard';

	}
	ngOnDestroy(): void {
		this.subs.dispose();
		this.elementRef.nativeElement.remove();

	}


Login(form) {
	this.message = '';
	this.optionselected = false;
	this.login_params = this.login_params
		// .set('userName',form.inputUser)
		.set('username', form.inputUser)
		.set('password', form.inputPassword);
		
		// .set('password', form.inputPassword)

		this.loginservice.signin(this.login_params).subscribe(res=>{

				localStorage.setItem('isLoggedIn', "true");  
				localStorage.setItem('token', res["accessToken"]); 
				localStorage.setItem('username', res["username"]); 
				localStorage.setItem('tokentype',res["tokenType"]);

				let navigationExtras: NavigationExtras = {
					queryParams: {
						"menus": res["menuary"]
					}
				};
			
				
				//localStorage.setItem('id', this.login_params.get('userName')); 
	
				this.router.navigate(['\dashboard'],navigationExtras);


		},error=>{
	//   set status to INA to show alert message;
	
			this.sts="INA";
			this.message=error.originalError.error.message;

			if (isUndefined(this.message))
			this.message=error.originalError.statusText;
			
		});


}



// menuHttpService(params)
// {

// 	let  myparam ={
// 		method:'/login/generateMenu.htm',
// 		xmltojs:'N'
// 		};

// 	let  data= null;
// 	console.log(params);
// 	this.subs.add=this.userservice.getdata(params,myparam).subscribe(res=>{
// 	console.log(res);
// 	data = JSON.parse(res);
// 	//console.log(data);

// 	this.menuHttpServiceResultHandler(data);
// 	});

// }

//  menuHttpServiceResultHandler(res):void
// {

// 	let navigationExtras: NavigationExtras = {
// 		queryParams: {
// 			"menus": JSON.stringify(res)
// 		}
// 	};

	
// 	//localStorage.setItem('id', this.login_params.get('userName')); 

// 	this.router.navigate(['\dashboard'],navigationExtras);

// }

}







