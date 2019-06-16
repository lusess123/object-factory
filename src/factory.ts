

import {
  IClassList, IClassMeta,
  IFetchConfig,
  IIocAsy, IRegisterTypeSrcConfig
} from './type'

type Optional<T> = T | null | undefined



const applyNew = (ctor, args: any[]) => {
  if (args && args.length > 0) {
    return new ctor(...args);
  }
  else {
    return new ctor();
  }
}

const getFunName = (s) => {
  if (typeof s == "string")
    return s;
  s = s.toString();
  var m = s.match(/function\s+([^(]+)/);
  if (m)
    return m[1];
  else
    return "";
}




export class FactoryContext {
  private static fIoc: FactoryContext = new FactoryContext();
  public static Current() {
    if(window["GLOBAL_IOC_FactoryContext"]) {
      this.fIoc = window["GLOBAL_IOC_FactoryContext"]
    } else {
      window["GLOBAL_IOC_FactoryContext"] = this.fIoc
    }
    return this.fIoc;
  }

  public getIocModel(): IClassList {
    return this.fInstanceClassList;
  }

  public getIocSrcModel(): IClassList {
    return this.fInstanceSrcList;
  }

  private fInstanceClassList: IClassList = {};
  private fInstanceSrcList: IClassList = {};



  public registerType(regName: string, baseType, instaceType, customData: any = {}) {
    regName = regName.toUpperCase();
    var _stre = getFunName(baseType);
    var _meta: IClassMeta = { RegName: regName, BaseType: baseType, InstanceType: instaceType, customData: customData };
    this.fInstanceClassList[_stre + "_" + regName] = _meta;

  }

  public registerTypeSrc(regName: string, baseType, src: any) {
    regName = regName.toUpperCase();
    var _stre = getFunName(baseType);
    var _meta: IClassMeta = { RegName: regName, BaseType: baseType, InstanceType: src };
    this.fInstanceSrcList[_stre + "_" + regName] = _meta;

  }




  public fetchAsyInstance<T>(regName: string, baseType,  config?: IRegisterTypeSrcConfig) {
      return this.fFetchAsyInstance<T>(regName, baseType,  config);
  }

  private async fFetchAsyInstance<T>(regName: string, baseType, config?: IRegisterTypeSrcConfig): Promise<Optional<T>>{
    const newRegName = regName.toUpperCase();
    var instanceObj: Optional<T> = this.fetchInstance<T>(newRegName, baseType, config ? { Args: config.Args } : undefined);
    if (!instanceObj) {
      var _stre = getFunName(baseType);
      var _meta: IClassMeta = this.fInstanceSrcList[_stre + "_" + newRegName];
      if (_meta) {

         await _meta.InstanceType()
         var obj: Optional<T> = this.fFetchInstance<T>(newRegName, baseType, config && config.Args ? { Args: config.Args } : undefined);
         return obj
      }
      else {
        console.log("注册名为 " + newRegName + "的类 " + _stre + "未注册 或者 不存在 ");
        return null
        // error(null);
      }
    }
    else {
      return instanceObj
    }
  }

  private fFetchInstance<T>(regName: string, baseType, config?: IFetchConfig): Optional<T> {
    const newRegName = regName.toUpperCase();
    var _stre = getFunName(baseType);
    var _meta: IClassMeta = this.fInstanceClassList[_stre + "_" + newRegName];

    if (_meta) {

      let _fun: Function = _meta.InstanceType;


      var _f = config && config.Args ? applyNew(_fun, config.Args) : new _meta.InstanceType();
      return _f;
    } else {
      console.log("注册名为: " + newRegName + "  类型为" + baseType + "没有注册");
      return undefined;
    }
  }

  

  public fetchInstance<T>(regName: string, baseType, config?: IFetchConfig): Optional<T> {
    regName = regName.toUpperCase();
    return this.fFetchInstance<T>(regName, baseType, config);
  }

  public getTypeList(baseType): Array<IClassMeta> {

    var _list = new Array<IClassMeta>();
    var _stre = getFunName(baseType);

    for (var _m in this.fInstanceClassList) {
      var _strM: string = _m;
      if (_strM.indexOf(_stre + "_") == 0) {

        var _col = this.fInstanceClassList[_strM];
        _list.push(_col);
      }
    }



    for (var _m in this.fInstanceSrcList) {
      var _strM: string = _m;
      if (_strM.indexOf(_stre + "_") == 0) {
        if (!this.fInstanceClassList[_strM]) {
          var _col = this.fInstanceSrcList[_strM];
          _list.push(_col);
        }
      }
    }



    return _list;

  }
}

interface IPlugMeta {
  RegName:string ,
  BaseType?:any,
  Author?:string,
  CreateDate?:string,
  Doc?:string
}

export function PlugIn(plugMeta:IPlugMeta) {
  return function (constructor) {
    const { RegName, BaseType,  ...rest}  = plugMeta
    FactoryContext.Current().registerType(RegName, BaseType, constructor, {
      ...rest
    });
  };
}


