import { IClassList, IClassMeta, IFetchConfig, IRegisterTypeSrcConfig } from './type';
declare type Optional<T> = T | null | undefined;
export declare class FactoryContext {
    private static fIoc;
    static Current(): FactoryContext;
    getIocModel(): IClassList;
    getIocSrcModel(): IClassList;
    private fInstanceClassList;
    private fInstanceSrcList;
    registerType(regName: string, baseType: any, instaceType: any, customData?: any): void;
    registerTypeSrc(regName: string, baseType: any, src: any): void;
    fetchAsyInstance<T>(regName: string, baseType: any, config?: IRegisterTypeSrcConfig): Promise<T>;
    private fFetchAsyInstance;
    private fFetchInstance;
    fetchInstance<T>(regName: string, baseType: any, config?: IFetchConfig): Optional<T>;
    getTypeList(baseType: any): Array<IClassMeta>;
}
interface IPlugMeta {
    RegName: string;
    BaseType?: any;
    Author?: string;
    CreateDate?: string;
    Doc?: string;
}
export declare function PlugIn(plugMeta: IPlugMeta): (constructor: any) => void;
export {};
