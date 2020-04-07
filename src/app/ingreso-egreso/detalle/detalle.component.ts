import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosEgresosSubs: Subscription;

  constructor( private store: Store<AppState>,
               private ingresoEgresoService: IngresoEgresoService ) { }

  ngOnInit(): void {
    this.ingresosEgresosSubs = this.store.select('ingresosEgresos')
      .subscribe( ingresosEgresos => {
        this.ingresosEgresos = ingresosEgresos.items;
      });
  }

  ngOnDestroy() {

    if ( this.ingresosEgresosSubs != null) {
      console.log('antes de');
      this.ingresosEgresosSubs.unsubscribe();
    }
  }

  borrar( uid: string ) {

    this.ingresoEgresoService.borrarIngresoEgreso( uid )
      .then( () => {
        Swal.fire({
          titleText: 'Elemento borrado',
          icon: 'success',
          title: 'woot!',
        });
      } )
      .catch( err => {
        Swal.fire({
          titleText: 'Error: ' + err.message,
          icon: 'error',
          title: 'woot!',
        });
      } );
  }

}
