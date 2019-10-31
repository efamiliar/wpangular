import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantGlobals } from './constant-globals';

@Injectable({
  providedIn: 'root'
})
export class WprestNoAuthService {

  constructor(
    private httpClient: HttpClient
    ) { }

  // GENERAL

  // Get the site information from the generic wp-json endpoint
  getSiteInfo(){
    return this.httpClient.get(ConstantGlobals.WP_API_BASE, {observe: 'response'});
  }

  getPermalinkStructure(){
    return this.httpClient.get(ConstantGlobals.WP_API_BASE + '/wpangular/v1/permalinks', {observe: 'response'});
  }





  // POSTS

  getPosts(page){
    return this.httpClient.get(ConstantGlobals.WP_API_BASE + '/wp/v2/posts?per_page=10&page='+page, {observe: 'response'});
  }

  getPostsInCategory(categoryId,page){
    return this.httpClient.get(ConstantGlobals.WP_API_BASE + '/wp/v2/posts?categories='+categoryId+'&per_page=10&page='+page, {observe: 'response'});
  }

  getPostsInTag(tagId,page){
    return this.httpClient.get(ConstantGlobals.WP_API_BASE + '/wp/v2/posts?tags='+tagId+'&per_page=10&page='+page, {observe: 'response'});
  }

  getPostById(id){
    return this.httpClient.get(ConstantGlobals.WP_API_BASE + '/wp/v2/posts/'+id, {observe: 'response'});
  }

  getPostBySlug(slug){
    return this.httpClient.get(ConstantGlobals.WP_API_BASE + '/wp/v2/posts?slug='+slug, {observe: 'response'});
  }





  // MENU (special custom post type)

  getMenuAtLocation(slug){
    return this.httpClient.get(ConstantGlobals.WP_API_BASE + '/wpangular/v1/menus/location/'+slug, {observe: 'response'});
  }





  // TAXONOMIES

  getCategories(){
    return this.httpClient.get(ConstantGlobals.WP_API_BASE + '/wp/v2/categories', {observe: 'response'});
  }

  getCategoryById(id){
    return this.httpClient.get(ConstantGlobals.WP_API_BASE + '/wp/v2/categories/'+id, {observe: 'response'});
  }

  getCategoryBySlug(slug){
    return this.httpClient.get(ConstantGlobals.WP_API_BASE + '/wp/v2/categories?slug='+slug, {observe: 'response'});
  }

  getTags(){
    return this.httpClient.get(ConstantGlobals.WP_API_BASE + '/wp/v2/tags', {observe: 'response'});
  }

  getTagById(id){
    return this.httpClient.get(ConstantGlobals.WP_API_BASE + '/wp/v2/tags/'+id, {observe: 'response'});
  }

  getTagBySlug(slug){
    return this.httpClient.get(ConstantGlobals.WP_API_BASE + '/wp/v2/tags?slug='+slug, {observe: 'response'});
  }




  // PAGES

  getPages(){
    return this.httpClient.get(ConstantGlobals.WP_API_BASE + '/wp/v2/pages', {observe: 'response'});
  }

  getPageById(id){
    return this.httpClient.get(ConstantGlobals.WP_API_BASE + '/wp/v2/pages/'+id, {observe: 'response'});
  }

  getPageBySlug(slug){
    return this.httpClient.get(ConstantGlobals.WP_API_BASE + '/wp/v2/pages?slug='+slug, {observe: 'response'});
  }

}
