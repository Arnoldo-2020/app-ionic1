import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.css'],
})
export class ForgotPasswordPage implements OnInit {

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private router: Router ) { }

  ngOnInit() {
  }

  public forgotForm = this.fb.group({
    email: ['test100@gmail.com', [Validators.required, Validators.email]],
  });

  async resetPassword(){
    const email = this.forgotForm.get('email').value;

    try {
      await this.authService.resetPassword(email);
      this.router.navigate(['/auth/login']);
      
    } catch (error) {
      console.log ("Error: ", error);
    }

  }

}
