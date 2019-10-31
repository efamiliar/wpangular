import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DynamicGlobalsService{

  public tagBase: string;
  public categoryBase: string;
  public permalinkStructure: any;
  public siteName: string;
  public siteDescription: string; 
  public mainMenu : any;

  constructor(){}
}
