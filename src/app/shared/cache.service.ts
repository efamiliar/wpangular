import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CacheService{

    private requests: any = {};

    constructor(){}

    addToCache(key: string, response: HttpResponse<any>): void {
        this.requests[key] = response;
    }

    getFromCache(key: string): HttpResponse<any> | undefined {
        return this.requests[key];
    }

    invalidateCache(): void {
        this.requests = {};
    }

}