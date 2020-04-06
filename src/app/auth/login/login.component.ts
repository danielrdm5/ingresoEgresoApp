import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
              private serviceAuth: AuthService,
              private router: Router ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({

      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]

    });
  }

  loginUsuario() {

    if ( this.loginForm.valid ) {
      Swal.fire({
        title: 'Espere por favor',
        onBeforeOpen: () => {
          Swal.showLoading();
        }
      });

      const { correo, password } = this.loginForm.value;

      this.serviceAuth.loginUsuario( correo, password )
        .then( credenciales => {
          Swal.close();
          this.router.navigate( ['/'] );
        })
        .catch( err => Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        }) );
    }

  }

}
