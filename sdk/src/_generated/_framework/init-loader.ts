import * as package_source_1 from "../_dependencies/source/0x1/init";
import * as package_source_2 from "../_dependencies/source/0x2/init";
import * as package_source_5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9 from "../_dependencies/source/0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9/init";
import * as package_source_70e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63 from "../_dependencies/source/0x70e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63/init";
import * as package_source_f59c363a3af10f51e69c612c5fa01f6500701254043f057e132cdbd27b67d14f from "../_dependencies/source/0xf59c363a3af10f51e69c612c5fa01f6500701254043f057e132cdbd27b67d14f/init";
import * as package_source_11e03be85d2b5f1ddef785fe1dfa129551f69913c41324ac0cad116031579588 from "../bucket-saving-incentive/init";
import {StructClassLoader} from "./loader";

function registerClassesSource(loader: StructClassLoader) { package_source_1.registerClasses(loader);
package_source_2.registerClasses(loader);
package_source_70e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63.registerClasses(loader);
package_source_11e03be85d2b5f1ddef785fe1dfa129551f69913c41324ac0cad116031579588.registerClasses(loader);
package_source_5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9.registerClasses(loader);
package_source_f59c363a3af10f51e69c612c5fa01f6500701254043f057e132cdbd27b67d14f.registerClasses(loader);
 }

export function registerClasses(loader: StructClassLoader) { registerClassesSource(loader); }
