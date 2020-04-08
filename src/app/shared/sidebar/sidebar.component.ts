import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Usuario } from '../../models/usuario.model';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombre = 'Desconocido';
  userSubscription: Subscription;

  constructor( private serviceAuth: AuthService,
               private router: Router,
               private store: Store<AppState> ) { }

  ngOnInit(): void {

    this.userSubscription = this.store.select('user')
      .subscribe( user => this.nombre = user.user?.nombre );

  }


  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  logOut() {

    Swal.fire({
      title: 'Espere por favor',
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });


    this.serviceAuth.logOut()
      .then( () => { Swal.close();
                     this.router.navigate(['/login']);
                      } );

  }

}
