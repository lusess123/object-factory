export interface IClassMeta {
  RegName: string;
  Author?: string;
  Message?: string;
  BaseType: any;
  InstanceType: any;
  customData?: any
}

export interface IErrorData
{
  Path: string;
  error: string;
}
export interface IInstanceMeta {
  ClassMeta: IClassMeta;
  InstanceObj: any;
}

export interface IInstanceDict
{
  [index: string]: IInstanceMeta;
}

export interface IClassList {
  [index: string]: IClassMeta;
}

 

 
export interface IIocAsy<T> {
  (obj: T): void;
}
export interface IRegisterTypeSrcConfig {
  NullFun?: INullFun;
  Args?: any[];
}
export interface INullFun {
  (regName: string, baseTypeStr: string): void
}

export interface IFetchConfig {
  Args?: any[];
}