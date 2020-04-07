import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  loading = false;
  uiSubscription: Subscription;

  constructor( private fb: FormBuilder,
               private serviceAuth: AuthService,
               private router: Router,
               private store: Store<AppState> ) { }

  ngOnInit(): void {

    this.registroForm = this.fb.group({

      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email] ],
      password: ['', Validators.required]

    });
    this.uiSubscription = this.store.select('ui').subscribe( ui => this.loading = ui.isLoading );
  }


  ngOnDestroy() {
    console.log('antes de');
    this.uiSubscription.unsubscribe();
  }


  crearUsuario() {

    if ( this.registroForm.valid ) {
      this.store.dispatch(ui.isLoading());
      // Swal.fire({
      //   title: 'Espere por favor',
      //   onBeforeOpen: () => {
      //     Swal.showLoading();
      //   }
      // });

      const { nombre, correo, password } = this.registroForm.value;

      this.serviceAuth.crearUsuario( nombre, correo, password )
        .then( credenciales => {
          this.store.dispatch(ui.stopLoading());
          // Swal.close();
          this.router.navigate( ['/'] );
        })
        .catch(err => {
          this.store.dispatch(ui.stopLoading());
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message,
          });
        });
    }

  }

}
