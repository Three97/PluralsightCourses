import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: "root"
})
export class ProductDetailGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean {
    const id = Number(route.paramMap.get("id"));
    if (isNaN(id) || id <= 0) {
      alert("Invalid route. Redirecting to products page");
      this.router.navigate(["./products"]);
      return false;
    }
    return true;
  }
}
