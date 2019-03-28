import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {ModalDService}from '../services/modal.service'
import { Router } from "@angular/router";



@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {

  constructor(private modalDService : ModalDService,private router : Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if (this.modalDService._movieD==undefined) {
        this.router.navigateByUrl('movies');
        return false;
      }
    return true;
  }


}
