import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy{

    isLoginMode = true;
    isLoading = false;
    error: string = null;
    @ViewChild(PlaceHolderDirective, {static: false}) alertHost: PlaceHolderDirective;
    private closeSub: Subscription;

    constructor(private authService: AuthService, private router: Router, private compomentFactoryResolver: ComponentFactoryResolver){}

    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form : NgForm){
        if(! form.valid){
            return;
        }

        this.isLoading = true;

        const email = form.value.email;
        const password = form.value.password;

        let authObs: Observable<AuthResponseData>

        if(this.isLoginMode){
            authObs = this.authService.login(email, password);
        }
        else {
            authObs = this.authService.signup(email, password);
            form.reset();
        }   
        
        authObs.subscribe( responseData => {
            console.log(responseData);
            this.isLoading = false;
            this.router.navigate(['/recipes']);
        },
        errorMessage => {
            console.log(errorMessage);
            this.error = errorMessage;
            this.showErrorAlert(errorMessage);
            this.isLoading = false;
        });
    }

    onHandleError() {
        this.error = null;
    }

    private showErrorAlert(message: string) {

        const alertCmpFactory = this.compomentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();

        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        });
    }

    ngOnDestroy(){
        if(this.closeSub){
            this.closeSub.unsubscribe();
        }
    }
}