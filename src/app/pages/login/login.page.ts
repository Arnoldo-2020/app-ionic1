import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
})
export class LoginPage implements OnInit {

  constructor( private fb: FormBuilder, 
               private authService: AuthService,
               private router: Router ) { }

  ngOnInit() {
  }

  public loginForm = this.fb.group({
    email: ['test100@gmail.com', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    password: ['123456', [Validators.required, Validators.minLength(6)]], 
  });

  async onLogin(){
    const {email, password} = this.loginForm.value;

    try {
      const user = await this.authService.logIn(email, password);
      if(user){
        const isVerified = this.authService.isEmailVerified(user);
        this.redirectUser(isVerified);
        console.log("Is verified? ", isVerified);
      }
    } catch (error) {
      console.log ("Error: ", error);
    }

  }

  private redirectUser(isVerified: boolean){
    if(isVerified){
      this.router.navigate(['auth/admin']);
    }else{
      this.router.navigate(['auth/verify-email']);
    }
  }

}
