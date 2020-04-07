import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';


import * as authActions from '../auth/auth.actions';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;
  private _user: Usuario;

  get user() {
    return this._user;
  }

  constructor( public auth: AngularFireAuth,
               private fireStore: AngularFirestore,
               private store: Store<AppState> ) { }

  initAuthListener() {
    this.auth.authState.subscribe( fuser => {

      if (fuser) {

        this.userSubscription = this.fireStore.doc(`${ fuser.uid }/usuario`).valueChanges()
          .subscribe( (fireStoreUser: any) => {
            const user = Usuario.fromFireBase( fireStoreUser );
            this._user = user;
            this.store.dispatch( authActions.setUser({ user }));
          });
      } else {
        if (this.userSubscription != null ) { this.userSubscription.unsubscribe(); }
        this._user = null;
        this.store.dispatch( authActions.unSetUser() );
        this.store.dispatch( ingresoEgresoActions.unsetItems() );
      }

    });
  }

  loginUsuario( email: string, password: string ) {
    return this.auth.signInWithEmailAndPassword( email, password );
  }


  crearUsuario( nombre: string, email: string, password: string ) {
    return this.auth.createUserWithEmailAndPassword( email, password )
        .then( fbUser => {

          const nuevoUsuario = new Usuario( fbUser.user.uid, nombre, fbUser.user.email );
          return this.fireStore.doc(`${fbUser.user.uid}/usuario`)
            .set( { ...nuevoUsuario}  );

        });
  }


  logOut() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map( fbUser => fbUser != null )
    );
  }

}
