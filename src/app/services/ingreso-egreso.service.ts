import { Injectable } from '@angular/core';

// FireStore
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';


import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor( private fireStore: AngularFirestore,
               private authService: AuthService ) { }

  crearIngresoEgreso( ingresoEgreso: IngresoEgreso ) {

    delete ingresoEgreso.uid;

    console.log(ingresoEgreso);
    const uid = this.authService.user.uid;
    return this.fireStore.doc(`${uid}/ingresos-egresos`)
      .collection('items')
      .add({ ...ingresoEgreso });

  }


  initIngresosEgresosListener(uid: string) {

    return this.fireStore.collection(`${ uid }/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map( snapshot => {
          return snapshot.map ( doc => {
            return {
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data() as any
            }
          });
        })
      );
  }



  borrarIngresoEgreso( uidItem: string ) {
    const uid = this.authService.user.uid;

    return this.fireStore.doc(`${ uid }/ingresos-egresos/items/${ uidItem }`).delete();

  }





}
