import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements OnInit, OnDestroy {

  nombre = 'Desconocido';
  userSubscription: Subscription;

  constructor( private serviceAuth: AuthService,
               private router: Router,
               private store: Store<AppState>  ) { }
          
  ngOnInit(): void {
    this.userSubscription = this.store.select('user')
    .subscribe( user => this.nombre = user.user?.nombre );
  }

  ngOnDestroy() {

    this.userSubscription?.unsubscribe();
  }

}
