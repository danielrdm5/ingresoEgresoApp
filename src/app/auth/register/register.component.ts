import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup;


  constructor( private fb: FormBuilder,
               private serviceAuth: AuthService,
               private router: Router ) { }

  ngOnInit(): void {

    this.registroForm = this.fb.group({

      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email] ],
      password: ['', Validators.required]

    });

  }

  crearUsuario() {

    if ( this.registroForm.valid ) {

      Swal.fire({
        title: 'Espere por favor',
        onBeforeOpen: () => {
          Swal.showLoading();
        }
      });

      const { nombre, correo, password } = this.registroForm.value;

      this.serviceAuth.crearUsuario( nombre, correo, password )
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
