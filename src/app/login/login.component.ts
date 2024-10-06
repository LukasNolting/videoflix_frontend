import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { LoginModel } from '../models/login.model';
import { lastValueFrom } from 'rxjs';
import { provideHttpClient, withFetch } from '@angular/common/http'; // importiere auch withFetch
@Injectable({
  providedIn: 'root',  // Stellt sicher, dass der Service global verfügbar ist
})

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  isPasswordVisible: boolean = false;

  constructor(private fb: FormBuilder ,private as: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      remember: [false],
    });
  }


  onSubmit() {
    if (this.loginForm.valid) {
      this.login();
    } else {
      console.log('invalid form');
    }
  }


  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


  async login() {
    try {
      let user = new LoginModel(this.loginForm.value.email, this.loginForm.value.password);
      const response = await lastValueFrom(
        this.as.loginWithEmailAndPassword(user)
      );
      this.as.setToken(response.token);
      localStorage.setItem('remember', this.loginForm.value.remember.toString());
      this.router.navigate(['videoflix/home']);
    } catch (error) {
      console.log(error);
    }
  }
}