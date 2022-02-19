export class OpenApiService {
  constructor(public data: any) {}

  getTagsFormPaths(searchReq: SearchOpenApiReq): TagInfo[] {
    const paths = this.data.paths;

    let tags: TagInfo[] = [];

    Object.keys(paths).forEach((pathKey) => {
      const pathValue = paths[pathKey];

      Object.keys(pathValue).forEach((methodKey) => {
        const methodValue = pathValue[methodKey];

        if (methodValue.tags != null && methodValue.tags.length) {
          methodValue.tags.forEach((apiTag: string) => {
            let targetTag = tags.find((tag) => tag.name === apiTag);

            if (!targetTag) {
              targetTag = {
                name: apiTag,
                apis: [],
              } as TagInfo;

              tags.push(targetTag);
            }

            let targetApi = targetTag.apis.find((api) => api.path === pathKey);

            if (!targetApi) {
              targetApi = {
                path: pathKey,
                methods: [],
              } as ApiInfo;

              targetTag.apis.push(targetApi);
            }

            targetApi.methods.push(methodKey);
          });
        }
      });
    });

    tags = tags.filter((tag) => {
      tag.apis = tag.apis.filter((api) => {
        if (searchReq.pathKeyword != null) {
          return api.path.includes(searchReq.pathKeyword);
        } else {
          return true;
        }
      });

      return tag.apis.length;
    });

    return tags;
  }

  search(searchReq: SearchOpenApiReq): SearchOpenApiRes {
    const data = this.data;

    const dataFilter = JSON.parse(JSON.stringify(data));

    const pagination = searchReq.pagination;

    let paths = dataFilter.paths;

    const startIndex =
      pagination.currentPage * pagination.limitItem - pagination.limitItem;
    const endIndex = startIndex + pagination.limitItem;

    const tagsOverAll = this.getTagsFormPaths(searchReq);

    const tags = tagsOverAll.slice(startIndex, endIndex);

    // remove tag
    if (dataFilter.tags) {
      dataFilter.tags = dataFilter.tags.filter((tag: any) =>
        tags.map((tagInfo) => tagInfo.name).includes(tag.name)
      );

      // add new tags
      tags.forEach((tagInfo) => {
        const existTag = dataFilter.tags.find(
          (tag: any) => tag.name === tagInfo.name
        );

        if (!existTag) {
          dataFilter.tags.push({
            name: tagInfo.name,
          });
        }
      });
    }

    paths = Object.keys(paths)
      .filter((pathKey) => {
        // TODO add search api
        let pathValue = paths[pathKey];

        paths[pathKey] = Object.keys(pathValue)
          .filter((methodKey) => {
            const methodValue = pathValue[methodKey];
            // HOTFIX
            const tag = tags.find(
              (tagInfo) => tagInfo.name === methodValue.tags[0]
            );

            if (!tag) {
              return false;
            }

            const api = tag.apis.find(
              (apiInfo) =>
                apiInfo.path === pathKey && apiInfo.methods.includes(methodKey)
            );

            return api;
          })
          .reduce((obj: any, key: string) => {
            obj[key] = pathValue[key];
            return obj;
          }, {});
        return Object.keys(paths[pathKey]).length;
      })
      .reduce((obj: any, key: string) => {
        obj[key] = paths[key];
        return obj;
      }, {});

    return {
      data: dataFilter,
      totalItem: tagsOverAll.length,
    } as SearchOpenApiRes;
  }
}

export interface ApiInfo {
  path: string;
  methods: string[];
}

export interface TagInfo {
  name: string;
  apis: ApiInfo[];
}

export interface Pagination {
  currentPage: number;
  limitItem: number;
}

export interface SearchOpenApiReq {
  pathKeyword?: string;
  pagination: Pagination;
}

export interface SearchOpenApiRes {
  data?: any;
  totalItem: number;
}
