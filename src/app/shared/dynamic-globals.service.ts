import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DynamicGlobalsService {

  public tagBase: string = 'tag';
  public categoryBase: string = 'category';
  public permalinkStructure: any;

  constructor() { }
}
