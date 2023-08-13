import { HostListener, Injectable } from '@angular/core';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  isSmallScreen;
  private drawer: MatDrawer;
  private drawerState = new BehaviorSubject<boolean>(true);

  constructor() { }

toggleDrawer(){
  this.drawerState.next(!this.drawerState.value);
}

getDrawerState() {
  return this.drawerState.asObservable();
}

  setDrawer(drawer: MatDrawer){
    this.drawer = drawer;
  }

  open():void{
    this.drawer?.open();
  }

  close():void{
    this.drawer?.close();
  }

  toggle(){
    console.log(this.drawerState.value);
    if(this.drawerState.value){
      this.drawerState.next(false);
    } else {
      this.drawerState.next(true);
    }
  }

 

  checkScreenSize() {
    if(window.innerWidth < 600) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
    }
  }
}
