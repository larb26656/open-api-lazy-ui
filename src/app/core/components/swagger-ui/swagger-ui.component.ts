import { Component, Input, OnInit } from '@angular/core';

declare const SwaggerUIBundle: any;

@Component({
  selector: 'swagger-ui',
  templateUrl: './swagger-ui.component.html',
  styleUrls: ['./swagger-ui.component.scss'],
})
export class SwaggerUiComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  render(spec: any) {
    SwaggerUIBundle({
      dom_id: '#swagger-ui',
      layout: 'BaseLayout',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset,
      ],
      spec: spec,
      docExpansion: 'none',
      operationsSorter: 'alpha',
    });
  }
}
