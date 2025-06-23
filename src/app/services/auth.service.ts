import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, docData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface UserProfile {
  uid: string;
  email: string;
  userType: 'employer' | 'worker';
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    this.user$ = authState(this.auth);
  }

  async signUp(email: string, password: string, userType: 'employer' | 'worker'): Promise<any> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);

      if (credential.user) {
        const userProfile: UserProfile = {
          uid: credential.user.uid,
          email: email,
          userType: userType,
          createdAt: new Date()
        };

        const userDocRef = doc(this.firestore, 'users', credential.user.uid);
        await setDoc(userDocRef, userProfile);
        return credential;
      }
    } catch (error) {
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<any> {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      return credential;
    } catch (error) {
      throw error;
    }
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/home']);
  }

  isAuthenticated(): Observable<boolean> {
    return authState(this.auth).pipe(
      map(user => !!user)
    );
  }

  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const subscription = authState(this.auth).subscribe(user => {
        subscription.unsubscribe();
        resolve(user);
      });
    });
  }

  getUserProfile(uid: string): Observable<UserProfile | undefined> {
    const userDocRef = doc(this.firestore, 'users', uid);
    return docData(userDocRef) as Observable<UserProfile | undefined>;
  }
}
