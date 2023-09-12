import { HostListener, Injectable } from '@angular/core';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  showCodeLearningLogo: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isSmallScreen;
  private drawer: MatDrawer;
  private drawerState = new BehaviorSubject<boolean>(true);

  constructor() {
    this.checkScreenSize();
   }

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
    // console.log(this.drawerState.value);
    if(this.drawerState.value){
      this.drawerState.next(false);
    } else {
      this.drawerState.next(true);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if(window.innerWidth < 650) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
    }
  }

  setMyVariable(value:boolean) {
    this.showCodeLearningLogo.next(value);
  }

  codeLearning$(): Observable<boolean> {
    return this.showCodeLearningLogo.asObservable();
  }
}
