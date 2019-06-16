var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const applyNew = (ctor, args) => {
    if (args && args.length > 0) {
        return new ctor(...args);
    }
    else {
        return new ctor();
    }
};
const getFunName = (s) => {
    if (typeof s == "string")
        return s;
    s = s.toString();
    var m = s.match(/function\s+([^(]+)/);
    if (m)
        return m[1];
    else
        return "";
};
export class FactoryContext {
    constructor() {
        this.fInstanceClassList = {};
        this.fInstanceSrcList = {};
    }
    static Current() {
        if (window["GLOBAL_IOC_FactoryContext"]) {
            this.fIoc = window["GLOBAL_IOC_FactoryContext"];
        }
        else {
            window["GLOBAL_IOC_FactoryContext"] = this.fIoc;
        }
        return this.fIoc;
    }
    getIocModel() {
        return this.fInstanceClassList;
    }
    getIocSrcModel() {
        return this.fInstanceSrcList;
    }
    registerType(regName, baseType, instaceType, customData = {}) {
        regName = regName.toUpperCase();
        var _stre = getFunName(baseType);
        var _meta = { RegName: regName, BaseType: baseType, InstanceType: instaceType, customData: customData };
        this.fInstanceClassList[_stre + "_" + regName] = _meta;
    }
    registerTypeSrc(regName, baseType, src) {
        regName = regName.toUpperCase();
        var _stre = getFunName(baseType);
        var _meta = { RegName: regName, BaseType: baseType, InstanceType: src };
        this.fInstanceSrcList[_stre + "_" + regName] = _meta;
    }
    fetchAsyInstance(regName, baseType, config) {
        return this.fFetchAsyInstance(regName, baseType, config);
    }
    fFetchAsyInstance(regName, baseType, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const newRegName = regName.toUpperCase();
            var instanceObj = this.fetchInstance(newRegName, baseType, config ? { Args: config.Args } : undefined);
            if (!instanceObj) {
                var _stre = getFunName(baseType);
                var _meta = this.fInstanceSrcList[_stre + "_" + newRegName];
                if (_meta) {
                    yield _meta.InstanceType();
                    var obj = this.fFetchInstance(newRegName, baseType, config && config.Args ? { Args: config.Args } : undefined);
                    return obj;
                }
                else {
                    console.log("注册名为 " + newRegName + "的类 " + _stre + "未注册 或者 不存在 ");
                    return null;
                    // error(null);
                }
            }
            else {
                return instanceObj;
            }
        });
    }
    fFetchInstance(regName, baseType, config) {
        const newRegName = regName.toUpperCase();
        var _stre = getFunName(baseType);
        var _meta = this.fInstanceClassList[_stre + "_" + newRegName];
        if (_meta) {
            let _fun = _meta.InstanceType;
            var _f = config && config.Args ? applyNew(_fun, config.Args) : new _meta.InstanceType();
            return _f;
        }
        else {
            console.log("注册名为: " + newRegName + "  类型为" + baseType + "没有注册");
            return undefined;
        }
    }
    fetchInstance(regName, baseType, config) {
        regName = regName.toUpperCase();
        return this.fFetchInstance(regName, baseType, config);
    }
    getTypeList(baseType) {
        var _list = new Array();
        var _stre = getFunName(baseType);
        for (var _m in this.fInstanceClassList) {
            var _strM = _m;
            if (_strM.indexOf(_stre + "_") == 0) {
                var _col = this.fInstanceClassList[_strM];
                _list.push(_col);
            }
        }
        for (var _m in this.fInstanceSrcList) {
            var _strM = _m;
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
FactoryContext.fIoc = new FactoryContext();
export function PlugIn(plugMeta) {
    return function (constructor) {
        const { RegName, BaseType } = plugMeta, rest = __rest(plugMeta, ["RegName", "BaseType"]);
        FactoryContext.Current().registerType(RegName, BaseType, constructor, Object.assign({}, rest));
    };
}
