import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-auth-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-input.component.html',
  styleUrl: './auth-input.component.scss',
})
export class AuthInputComponent {
  public isFocused: boolean = false;

  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() src: string = '';
  @Input() type: string = 'text';
  @Input() error: string = '';

  @Output() changeText = new EventEmitter<string>();

  constructor() {}

  onFocus() {
    this.isFocused = true;
  }
  onBlur() {
    this.isFocused = false;
  }

  onChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (value) {
      this.changeText.emit(value);
    }
  }
}
