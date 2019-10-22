import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantGlobals } from './constant-globals';

@Injectable({
  providedIn: 'root'
})
export class WprestWithAuthService {

  constructor(private httpClient: HttpClient){}


  // LOGIN AND LOGOUT
  
  // Login (currently via the JWT Auth plugin)
  doLogin(userLoginData){
    return this.httpClient.post(ConstantGlobals.WP_API_BASE + '/jwt-auth/v1/token',userLoginData);
  }

  // Validate current user token
  validateToken(){  
    // Pass any empty object (because a request body is required)
    let emptyObject = {}

    // Send POST request
    return this.httpClient.post(ConstantGlobals.WP_API_BASE + '/jwt-auth/v1/token/validate',emptyObject);
  }


  // POSTS

  // Create a new post
  createPost(){       
    let newPost = {
        title: 'Otra prueba',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        status: 'publish'
      }

    // Send POST request
    return this.httpClient.post(ConstantGlobals.WP_API_BASE + '/wp/v2/posts',newPost);
  }

  // Update an existing post
  updatePost(){       
    
    let newPost = {
        title: 'Nuevo título',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      }

    // Send POST request
    return this.httpClient.post(ConstantGlobals.WP_API_BASE + '/wp/v2/posts/5/',newPost);
  }


}