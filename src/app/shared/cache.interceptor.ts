import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { CacheService } from './cache.service';
import { ConstantGlobals } from './constant-globals';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

    private notFoundResponse: HttpResponse<any> = new HttpResponse({ status: 404 });

    constructor(private cacheService: CacheService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // Not declared as class properties because we don't want this value to survive
        let requestType: string;
        let requestParam: string;

        // Ignore other than GET requests
        if(req.method !== 'GET'){
            return next.handle(req);
        }


        // Detect - getPostBySlug requests for special caching 
        if(req.url.includes('/wp/v2/posts?slug=')){
            requestType = 'get-post-by-slug';
            requestParam = req.url.replace(ConstantGlobals.WP_API_BASE + '/wp/v2/posts?slug=','');
            
            console.log('Identified a get-post-by-slug request with slug ' + requestParam);
        }

        // Detect - getPostById requests for special caching 
        if(req.url.includes('/wp/v2/posts/')){
            requestType = 'get-post-by-id';
            requestParam = req.url.replace(ConstantGlobals.WP_API_BASE + '/wp/v2/posts/','');

            console.log('Identified a get-post-by-id request with id ' + requestParam);
        }

        // Detect - getPageBySlug requests for special caching 
        if(req.url.includes('/wp/v2/pages?slug=')){
            requestType = 'get-page-by-slug';
            requestParam = req.url.replace(ConstantGlobals.WP_API_BASE + '/wp/v2/pages?slug=','');
            
            console.log('Identified a get-page-by-slug request with slug ' + requestParam);
        }

        // Detect - getPageById requests for special caching 
        if(req.url.includes('/wp/v2/pages/')){
            requestType = 'get-page-by-id';
            requestParam = req.url.replace(ConstantGlobals.WP_API_BASE + '/wp/v2/pages/','');

            console.log('Identified a get-page-by-id request with id ' + requestParam);
        }

        // Detect - getCategoryBySlug requests for special caching 
        if(req.url.includes('/wp/v2/categories?slug=')){
            requestType = 'get-category-by-slug';
            requestParam = req.url.replace(ConstantGlobals.WP_API_BASE + '/wp/v2/categories?slug=','');
            
            console.log('Identified a get-category-by-slug request with slug ' + requestParam);
        }

        // Detect - getCategoryById requests for special caching 
        if(req.url.includes('/wp/v2/categories/')){
            requestType = 'get-category-by-id';
            requestParam = req.url.replace(ConstantGlobals.WP_API_BASE + '/wp/v2/categories/','');

            console.log('Identified a get-category-by-id request with id ' + requestParam);
        }

        // Detect - getTagBySlug requests for special caching 
        if(req.url.includes('/wp/v2/tags?slug=')){
            requestType = 'get-tag-by-slug';
            requestParam = req.url.replace(ConstantGlobals.WP_API_BASE + '/wp/v2/tags?slug=','');
            
            console.log('Identified a get-tag-by-slug request with slug ' + requestParam);
        }

        // Detect - getTagById requests for special caching 
        if(req.url.includes('/wp/v2/tags/')){
            requestType = 'get-tag-by-id';
            requestParam = req.url.replace(ConstantGlobals.WP_API_BASE + '/wp/v2/tags/','');

            console.log('Identified a get-tag-by-id request with id ' + requestParam);
        }

        // Check if we can already return data
        if(requestType && requestParam){
            let cachedResponse = this.cacheService.getFromCache(requestType + '-' + requestParam);
            if(cachedResponse){
                return of(new HttpResponse({ status: 200, body: cachedResponse }));
            }
        }


        // End Detect - Check for full URL match and return the whole cached HttpResponse if it exists
        let cachedResponse = this.cacheService.getFromCache(req.url);
        if(cachedResponse){
            return of(cachedResponse);
        }

        // No cached request found. Then do the actual request and cache in other cases
        return next.handle(req)
            .pipe(
                map(resp => {
                    if(resp instanceof HttpResponse){

                        let key: string;

                        // Detect Response - getPostBySlug
                        if(requestType == 'get-post-by-slug'){

                            if(resp.body[0]){
                            key = 'get-post-by-slug-' + resp.body[0].slug;
                            this.cacheService.addToCache(key, resp.body[0]);

                            key = 'get-post-by-id-' + resp.body[0].id;
                            this.cacheService.addToCache(key, resp.body[0]);

                            console.log('Saved Paired Cache for getPostBySlug', resp.body[0]);
                            return new HttpResponse({ status: 200, body: resp.body[0] });
                            }else{
                                return this.notFoundResponse;
                            }
         
                        }


                        // Detect Response - getPostById
                        if(requestType == 'get-post-by-id'){

                            if(resp.body){
                            key = 'get-post-by-id-' + resp.body.id;
                            this.cacheService.addToCache(key, resp.body);

                            key = 'get-post-by-slug-' + resp.body.slug;
                            this.cacheService.addToCache(key, resp.body);

                            console.log('Saved Paired Cache for getPostById', resp.body);
                            return new HttpResponse({ status: 200, body: resp.body });
                            }else{
                                return this.notFoundResponse;
                            }
                            
                        }


                        // Detect Response - getPageBySlug
                        if(requestType == 'get-page-by-slug'){

                            if(resp.body[0]){
                            key = 'get-page-by-slug-' + resp.body[0].slug;
                            this.cacheService.addToCache(key, resp.body[0]);

                            key = 'get-page-by-id-' + resp.body[0].id;
                            this.cacheService.addToCache(key, resp.body[0]);

                            console.log('Saved Paired Cache for getPageBySlug', resp.body[0]);
                            return new HttpResponse({ status: 200, body: resp.body[0] });
                            }else{
                                return this.notFoundResponse;
                            }
         
                        }


                        // Detect Response - getPageById
                        if(requestType == 'get-page-by-id'){

                            if(resp.body){
                            key = 'get-page-by-id-' + resp.body.id;
                            this.cacheService.addToCache(key, resp.body);

                            key = 'get-page-by-slug-' + resp.body.slug;
                            this.cacheService.addToCache(key, resp.body);

                            console.log('Saved Paired Cache for getPageById', resp.body);
                            return new HttpResponse({ status: 200, body: resp.body });
                            }else{
                                return this.notFoundResponse;
                            }
                            
                        }


                        // Detect Response - getCategoryBySlug
                        if(requestType == 'get-category-by-slug'){

                            if(resp.body[0]){
                            key = 'get-category-by-slug-' + resp.body[0].slug;
                            this.cacheService.addToCache(key, resp.body[0]);

                            key = 'get-category-by-id-' + resp.body[0].id;
                            this.cacheService.addToCache(key, resp.body[0]);

                            console.log('Saved Paired Cache for getCategoryBySlug', resp.body[0]);
                            return new HttpResponse({ status: 200, body: resp.body[0] });
                            }else{
                                return this.notFoundResponse;
                            }
         
                        }


                        // Detect Response - getCategoryById
                        if(requestType == 'get-category-by-id'){

                            if(resp.body){
                            key = 'get-category-by-id-' + resp.body.id;
                            this.cacheService.addToCache(key, resp.body);

                            key = 'get-category-by-slug-' + resp.body.slug;
                            this.cacheService.addToCache(key, resp.body);

                            console.log('Saved Paired Cache for getCategoryById', resp.body);
                            return new HttpResponse({ status: 200, body: resp.body });
                            }else{
                                return this.notFoundResponse;
                            }
                            
                        }


                        // Detect Response - getTagBySlug
                        if(requestType == 'get-tag-by-slug'){

                            if(resp.body[0]){
                            key = 'get-tag-by-slug-' + resp.body[0].slug;
                            this.cacheService.addToCache(key, resp.body[0]);

                            key = 'get-tag-by-id-' + resp.body[0].id;
                            this.cacheService.addToCache(key, resp.body[0]);

                            console.log('Saved Paired Cache for getTagBySlug', resp.body[0]);
                            return new HttpResponse({ status: 200, body: resp.body[0] });
                            }else{
                                return this.notFoundResponse;
                            }
         
                        }


                        // Detect Response - getTagById
                        if(requestType == 'get-tag-by-id'){

                            if(resp.body){
                            key = 'get-tag-by-id-' + resp.body.id;
                            this.cacheService.addToCache(key, resp.body);

                            key = 'get-tag-by-slug-' + resp.body.slug;
                            this.cacheService.addToCache(key, resp.body);

                            console.log('Saved Paired Cache for getTagById', resp.body);
                            return new HttpResponse({ status: 200, body: resp.body });
                            }else{
                                return this.notFoundResponse;
                            }
                            
                        }

                        // No special detect - Cache the whole URL
                        this.cacheService.addToCache(req.url, resp);
                        return resp;

                    }
                })
            );

    }

}