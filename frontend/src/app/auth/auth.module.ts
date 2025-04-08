import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { authRoutes } from './aut.routes';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
})
export class AuthModule {}
