import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ui from '../shared/ui.actions';


@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoEgresoForm: FormGroup;
  tipoMovimiento = 'ingreso';
  loading = false;
  uiSubscription: Subscription;

  constructor( private fb: FormBuilder,
               private ingresoEgresoService: IngresoEgresoService,
               private store: Store<AppState> ) { }

  
  // NgOnInit
  ngOnInit(): void {

    
    this.ingresoEgresoForm = this.fb.group( {
      descripcion: ['', Validators.required ],
      monto: ['', Validators.required ],
    });


    this.uiSubscription = this.store.select('ui')
      .subscribe( ({ isLoading }) => this.loading = isLoading );

  }

  ngOnDestroy() {
    console.log('antes de');
    this.uiSubscription.unsubscribe();
  }


  guardar() {

    if ( this.ingresoEgresoForm.valid ) {

      this.store.dispatch(ui.isLoading());

      const { descripcion, monto  } = this.ingresoEgresoForm.value;

      const ingresoEgreso = new IngresoEgreso( descripcion, monto, this.tipoMovimiento );
      this.ingresoEgresoService.crearIngresoEgreso( ingresoEgreso )
        .then( () => {
          this.ingresoEgresoForm.reset();
          this.store.dispatch(ui.stopLoading());
          Swal.fire({
            titleText: this.tipoMovimiento + ' creado',
            icon: 'success',
            title: 'woot!',
          });
        })
        .catch( err => {
          this.store.dispatch(ui.stopLoading());
          Swal.fire({
            titleText: this.tipoMovimiento + ' no creado',
            icon: 'error',
            title: 'woot!',
            text: 'Error: ' + err.message
          });
        });

    }

  }

}
