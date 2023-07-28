import { Injectable } from '@angular/core';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  private drawer: MatDrawer;

  constructor() { }

  setDrawer(drawer: MatDrawer){
    this.drawer = drawer;
  }

  open():void{
    this.drawer?.open();
  }
}
