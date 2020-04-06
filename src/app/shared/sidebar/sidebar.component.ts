import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  constructor( private serviceAuth: AuthService,
               private router: Router ) { }

  ngOnInit(): void {
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
