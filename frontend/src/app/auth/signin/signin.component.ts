import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AuthInputComponent } from '../components/auth-input/auth-input.component';
import { SubmitButtonComponent } from '../../components/submit-button/submit-button.component';
import { AuthService } from '../shared/service/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [AuthInputComponent, SubmitButtonComponent, ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
  public loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: [
        'test@test.example.com.tr',
        [Validators.required, Validators.minLength(3)],
      ],
      password: ['admin1234', [Validators.required, Validators.minLength(6)]],
    });
  }

  changeText(key: string, value: string): void {
    this.loginForm.controls[key].setValue(value);
    this.loginForm.controls[key].markAsTouched();
  }

  login(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.signIn({ email, password });
    } else {
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.controls[key].markAsTouched();
      });
    }
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.loginForm.controls[controlName];

    return control?.touched && control.hasError(errorName);
  }
}
