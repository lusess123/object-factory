import ObjectFactory from './../src'
import './async-test'
const { FactoryContext,PlugIn  } = ObjectFactory

export interface ITest {
  name :string
}

class Test1 implements ITest {
   name :'test1'
}

class Test2 implements ITest {
  name :'test2'
}
@PlugIn({RegName:'test3',BaseType:'ITest'})
class Test3 implements ITest {
  name :'test3'
}

@PlugIn({RegName:'test4',BaseType:'ITest'})
class Test4 implements ITest {
  name = 'test4'
}

FactoryContext.Current().registerType("test1",'ITest',Test1)
FactoryContext.Current().registerType("test2",'ITest',Test2)

FactoryContext.Current().registerTypeSrc("test5",'ITest', ()=> import('./module-test') )

console.log(FactoryContext.Current().getIocModel())
console.log(FactoryContext.Current().getIocSrcModel())

const getTest5 = async () => {
   const data = await FactoryContext.Current().fetchAsyInstance<ITest>("test5","ITest")
   const data2 = await FactoryContext.Current().fetchAsyInstance<ITest>("test4","ITest")
   alert(data2.name)
}

getTest5()