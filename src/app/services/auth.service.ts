import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';


import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( public auth: AngularFireAuth,
               private fireStore: AngularFirestore ) { }

  initAuthListener() {
    this.auth.authState.subscribe( fuser => {

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
    )
  }

}
