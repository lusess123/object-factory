import { ITest  } from './index'
import ObjectFactory from './../src'
const { FactoryContext,PlugIn  } = ObjectFactory
alert('async-test load')
@PlugIn({RegName:'test5',BaseType:'ITest'})
class Test5 implements ITest {
  name = 'test5'
}