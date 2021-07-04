import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../shared/interfaces/user.interface';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.css'],
})
export class VerifyEmailPage implements OnInit, OnDestroy {

  constructor( private authService: AuthService ) { }

  user$: Observable<User> =this.authService.fireAuth.user

  ngOnInit() {
  }

  async sendEmail():Promise<void>{
    try {
      await this.authService.sendVerificationEmail();
    } catch (error) {
      console.log ("Error: ", error);
    }
  }

  ngOnDestroy(): void {
    this.authService.logOut();
  }

}
