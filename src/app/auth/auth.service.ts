import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {

    user = new BehaviorSubject<User>(null);
    
    constructor(private http: HttpClient, private router: Router){}
    signup(email: string, password: string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBftNUWOJSinLRO_7HMOe17Vsmiba2SD_8',
        {
            email: email,
            password: password,
            returnSecureToken: true
        }
    ).pipe(catchError(this.handleError), tap(respData => {
        this.handleAuthentication(respData.email, respData.localId, respData.idToken, +respData.expiresIn);
    }));
    }

    login(email: string, password: string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBftNUWOJSinLRO_7HMOe17Vsmiba2SD_8',
        {
            email: email,
            password: password,
            returnSecureToken: true 
        }
    ).pipe(catchError(this.handleError), tap(respData => {
        this.handleAuthentication(respData.email, respData.localId, respData.idToken, +respData.expiresIn);
    }));
    }

    logout(){
        this.user.next(null);
        this.router.navigate(['/auth']);
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
    }

    private handleError(errorRes: HttpErrorResponse){
        let errorMessage = 'An unknown error occurred!';

        if(!errorRes.error || !errorRes.error.error){
            return throwError(errorMessage);
        }
        
        switch(errorRes.error.error.message){
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already!';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not found!';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'Invalid Password!';
                break;
            case 'USER_DISABLED':
                errorMessage = 'This user is disabled!';
        }
        return throwError(errorMessage);
    }

}