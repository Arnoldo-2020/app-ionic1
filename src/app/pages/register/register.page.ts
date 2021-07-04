import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.css'],
})
export class RegisterPage implements OnInit {

  formSubmitted: boolean = false;

  constructor( private authService: AuthService,
               private fb: FormBuilder,
               private router: Router ) { }

  ngOnInit() {
  }

  public registerForm = this.fb.group({
    email: ['test100@gmail.com', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    password: ['123456', [Validators.required, Validators.minLength(6)]], 
    password2: ['123456', [Validators.required, Validators.minLength(6)]]
  },{
    validators: this.equalsPasswords('password', 'password2')
  });

  async onRegister(){
    this.formSubmitted = true;

    const {email, password} = this.registerForm.value;

    try {
      const user = await this.authService.register(email, password);
      if(user){
        this.router.navigate(['auth/verify-email']);
        console.log ("User: ", user);
      }
    } catch (error) {
      console.log ("Error", error);
    }
  }

  formValidation(field: string):boolean{
    
    return this.registerForm.get(field).invalid;

  }

  equalsPasswords(pass1: string, pass2: string){

    return ( formGroup: FormGroup ) => {

      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      if( pass1Control.value === pass2Control.value ){
        pass2Control.setErrors(null);
      }else{
        pass2Control.setErrors({ noEsIgual: true });
      }

    }
  }

  passwordValidation(){

    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if(pass1 != pass2){
      return true;
    }else{
      return false;
    }

  }
  

}
