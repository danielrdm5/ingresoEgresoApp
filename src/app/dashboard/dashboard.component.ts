import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {


  userSubs: Subscription;
  ingresosEgresosSubs: Subscription;

  constructor( private store: Store<AppState>,
               private ingresoEgresoService: IngresoEgresoService ) { }

  ngOnInit(): void {

    this.userSubs = this.store.select('user')
      .pipe(
        filter( auth => auth.user != null )
      )
      .subscribe( user => {
        console.log(user);
        this.ingresosEgresosSubs = this.ingresoEgresoService.initIngresosEgresosListener( user.user.uid )
          .subscribe( ingresosEgresosFb => {
            console.log(ingresosEgresosFb);
            this.store.dispatch( ingresoEgresoActions.setItems( {items: ingresosEgresosFb} ) );
          } );
      });

  }


  ngOnDestroy() {
    console.log('antes de');
    this.userSubs.unsubscribe();
    this.ingresosEgresosSubs.unsubscribe();
    
  }

}
