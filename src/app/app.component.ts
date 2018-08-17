import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, NavParams, ToastController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { MenuController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';
import { Events } from 'ionic-angular';
import * as firebase from 'firebase';
// import { RootRenderNodes } from '@angular/core/src/view';


import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import {LoginPage} from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
   @ViewChild('mycontent') nav: NavController;

  public rootPage: string = "LoginPage";
  public connected: boolean = false;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private angularFireAuth: AngularFireAuth, private toast: ToastController, public events: Events, public menuCtrl: MenuController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage },
      { title: 'Login', component: LoginPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.angularFireAuth.auth.onAuthStateChanged(function(user){
        if (user) {
          this.rootPage = "HomePage";
        }else{
          this.rootPage = "LoginPage";
        }
      });
    });
  }

  activePage(){
  console.log(this.nav);
  if(this.nav.getActive().component.name == "HomePage") {
      // this.connected = true;
      console.log("Tu es dans la fonction et connected est " +this.connected);
  };
  if(this.nav.getActive().component.name !== "HomePage"){
    // this.connected = false;
    console.log("Tu es dans la fonction et connected est " +this.connected);
  };
}


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  async login(email, password) {
    const result = this.angularFireAuth.auth.signInWithEmailAndPassword(email, password);
    console.log(result);
    // console.log(current_page);
    // console.log(LoginPage);
    if (result) {
      this.toast.create({
        message: `Bienvenue sur SchoolApp, ${email}`,
        duration: 3000
      }).present();
      this.nav.setRoot('HomePage', {email});
      this.connected = true;
      this.activePage();
      this.menuCtrl.close();
      this.menuCtrl.open();
    }else {
      this.toast.create({
        message: `Cette adresse mail n'a aucun compte enregistré`,
        duration: 3000
      }).present();
      this.nav.setRoot('LoginPage');
    }
    // this.angularFireAuth.auth.signInWithEmailAndPassword(email, password).then((user) => {
    //
    // });
  }

  logout() : Promise <boolean>
   {
      return new Promise((resolve, reject) =>
      {
        firebase
        .auth()
        .signOut()
        .then(() =>
        {
           resolve(true);
           this.toast.create({
             message: "Vous avez bien été déconnecté",
             duration: 3000
           }).present();
           this.nav.setRoot('LoginPage');
           this.connected = false;
           this.activePage();
           this.menuCtrl.close();
           this.menuCtrl.open();
        })
        .catch((error : any) =>
        {
           reject(error);
        });
      });
   }

   // function(ev) {
   //   ev.preventDefault();
   //   ev.stopPropagation();
   //   this.activePage();
   //   this._menuCtrl.close();
   // }

   doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
}
