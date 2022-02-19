import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { filter, map, Observable, range } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { SwaggerUiComponent } from 'src/app/core/components/swagger-ui/swagger-ui.component';
import {
  OpenApiService,
  SearchOpenApiReq,
  SearchOpenApiRes,
} from 'src/app/services/open-api/open-api.service';

declare const SwaggerUIBundle: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // loading: boolean = false;

  // masterData: any;

  // totalItem: number = 0;

  // currentPage: number = 1;

  // pageSize: number = 25;

  // data: any;

  initDataInfo: InitDataInfo = {
    loading: false,
  };

  searchReq: SearchOpenApiReq = {
    pagination: {
      currentPage: 1,
      limitItem: 25,
    },
  };

  totalItem: number = 0;

  private openApiService!: OpenApiService;

  private swaggerUi!: SwaggerUiComponent;

  @ViewChild('swaggerUi') set swaggerUiSet(swagger: SwaggerUiComponent) {
    if (swagger) {
      this.swaggerUi = swagger;
    }
  }

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.initData();
  }
  initData() {
    this.initDataInfo.loading = true;
    this.initDataInfo.masterData = null;
    this.initDataInfo.data = null;

    this.httpClient
      .get(`http://103.13.31.37:18555/v3/api-docs/management`)
      .subscribe((data: any) => {
        this.initDataInfo.loading = false;

        this.initDataInfo.masterData = data;

        this.search();

        // this.initDataInfo.masterData = data;
        // this.initDataInfo.tags = Array.from(
        //   this.getTagsFormPaths(this.initDataInfo.masterData.paths)
        // );
        // this.initDataInfo.totalItem = this.initDataInfo.tags.length;

        // this.search();
      });
  }

  onPage({ pageIndex, pageSize }: PageEvent) {
    this.searchReq.pagination.currentPage = pageIndex + 1;
    this.searchReq.pagination.limitItem = pageSize;
    this.search();
  }

  search() {
    this.initDataInfo.data = JSON.parse(
      JSON.stringify(this.initDataInfo.masterData)
    );

    this.openApiService = new OpenApiService(this.initDataInfo.data);

    const res: SearchOpenApiRes = this.openApiService.search(this.searchReq);

    this.initDataInfo.data = res.data;
    this.totalItem = res.totalItem;

    // HOTFIX
    this.swaggerUi.render(this.initDataInfo.data);
  }
}

interface InitDataInfo {
  loading: boolean;

  masterData?: any;

  data?: any;
}
