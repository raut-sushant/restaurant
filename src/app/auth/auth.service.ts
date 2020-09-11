import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createEmitAndSemanticDiagnosticsBuilderProgram } from 'typescript';

interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {

    constructor(private http: HttpClient){}
    signup(email: string, password: string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBftNUWOJSinLRO_7HMOe17Vsmiba2SD_8',
        {
            email: email,
            password: password,
            returnSecureToken: true
        });
    }

}