import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';


@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {


    constructor(){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // Not declared as class properties because we don't want this value to survive
        let requiresAuthToken: boolean = false;

        // Pass along GET requests
        if(req.method == 'GET'){
            return next.handle(req);
        }

        // Detect - validateToken 
        if(req.url.includes('/jwt-auth/v1/token/validate')){
            requiresAuthToken = true; 
            console.log('Identified a validate-token request');
        }

        // Detect - create or update post 
        if(req.url.includes('/wp/v2/posts')){
            requiresAuthToken = true; 
            console.log('Identified a create or update post request');
        }

        // Check if authorization token is required
        if(requiresAuthToken){

            // Check if it's available
            if(localStorage.hasOwnProperty("userToken")){

                // Token validation is done at app.component ngOnInit
                req = req.clone({
                    headers: new HttpHeaders({
                    'Content-Type':  'application/json',
                    'Accept':  'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("userToken")
                    })
                });

            }else{
                return of(new HttpResponse({
                    status: 400
                    /*
                    400 (mal-formed) instead of 401 (unauthenticated)
                    Note: A token-requiring-request without token authorization is a mal-formed request
                    Why?: Because it does not have the required token and hence it is not correct-formed
                    */
                }));
            }

        }
        
        return next.handle(req);

    }
}