// common/ 里面文件的 ts 类型维护
export interface HttpResponse {
  status: number;
  data: any;
  errMsg: string;
}

/******** service.ts 里面的接口请求的参数ts类型定义 **********/
export interface QueryMenuList {
  userId: string;
}
