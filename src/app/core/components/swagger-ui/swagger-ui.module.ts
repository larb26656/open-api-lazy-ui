import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwaggerUiComponent } from './swagger-ui.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SwaggerUiComponent],
  exports: [SwaggerUiComponent],
})
export class SwaggerUiModule {}
