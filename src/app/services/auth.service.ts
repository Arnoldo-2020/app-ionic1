import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { User } from '../shared/interfaces/user.interface';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$: Observable<User>;

  constructor( public fireAuth: AngularFireAuth, private afs: AngularFirestore ) { 

    this.user$ = this.fireAuth.authState.pipe(
      switchMap((user) =>{
        if(user){
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    )

  }

  
  async resetPassword( email: string ):Promise<void>{

    try {
      return this.fireAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log ('Error: ', error);
    }

  }

  // async logInGoogle():Promise<any>{ 

  //   try {
  //     const { user } = await this.fireAuth.signInWithPopup( new fb )
  //     this.updateUserData(user);
  //     return user;
  //   } catch (error) {
  //     console.log ('Error: ', error);
  //   }

  //  }

  async register( email: string, password: string ):Promise<User>{ 

    try {
      const { user } = await this.fireAuth.createUserWithEmailAndPassword(email, password);
      await this.sendVerificationEmail();
      return user;
    } catch (error) {
      console.log ('Error: ', error);
    }

   }

  async logIn( email: string, password: string ):Promise<User>{ 

    try {
      const { user } = await this.fireAuth.signInWithEmailAndPassword(email, password);
      this.updateUserData(user);
      return user;
    } catch (error) {
      console.log ('Error: ', error);
    }

  }

  async sendVerificationEmail():Promise<void>{

    try {
      return (await this.fireAuth.currentUser).sendEmailVerification();
    } catch (error) {
      console.log('Error: ', error);
    }

  }

  isEmailVerified(user: User):boolean{
    return user.emailVerified === true ? true: false;
  }

  async logOut():Promise<void>{
    try {
      await this.fireAuth.signOut();
    } catch (error) {
      console.log ('Error: ', error);
    }
  }

  private updateUserData(user: User){ 
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
    };

    return userRef.set(data, { merge: true });
  }

  

}
