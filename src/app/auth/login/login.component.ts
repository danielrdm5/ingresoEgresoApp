import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  loading = false;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private serviceAuth: AuthService,
              private router: Router,
              private store: Store<AppState>) { }

  ngOnInit(): void {

    this.loginForm = this.fb.group({

      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]

    });

    this.uiSubscription = this.store.select('ui').subscribe( ui => this.loading = ui.isLoading );

  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  loginUsuario() {

    if (this.loginForm.valid) {

      this.store.dispatch(ui.isLoading());

      // Swal.fire({
      //   title: 'Espere por favor',
      //   onBeforeOpen: () => {
      //     Swal.showLoading();
      //   }
      // });

      const { correo, password } = this.loginForm.value;

      this.serviceAuth.loginUsuario(correo, password)
        .then(credenciales => {
          // Swal.close();
          this.store.dispatch(ui.stopLoading());
          this.router.navigate(['/']);
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
