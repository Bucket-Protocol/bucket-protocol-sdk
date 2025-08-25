import * as package_source_1 from "../_dependencies/source/0x1/init";
import * as package_source_2 from "../_dependencies/source/0x2/init";
import * as package_source_589bc31d4f89f3fc2c8c94f78ba7b234992c06408f1a1571927c971cf8fcc0ce from "../_dependencies/source/0x589bc31d4f89f3fc2c8c94f78ba7b234992c06408f1a1571927c971cf8fcc0ce/init";
import * as package_source_5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9 from "../_dependencies/source/0x5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9/init";
import * as package_source_70e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63 from "../_dependencies/source/0x70e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63/init";
import * as package_source_b818b22a88d614c266c5f4436fb4447dee1c4fba8071c456f864851eb6dd194d from "../bucket-psm/init";
import {StructClassLoader} from "./loader";

function registerClassesSource(loader: StructClassLoader) { package_source_1.registerClasses(loader);
package_source_2.registerClasses(loader);
package_source_70e683f4dac417906f42fee9a175b19120855ae37444cba84041d7f37b27f63.registerClasses(loader);
package_source_589bc31d4f89f3fc2c8c94f78ba7b234992c06408f1a1571927c971cf8fcc0ce.registerClasses(loader);
package_source_5eb92323ce3148b222cbf035804078ff52577f414cc7abcd4e20a1243e9907f9.registerClasses(loader);
package_source_b818b22a88d614c266c5f4436fb4447dee1c4fba8071c456f864851eb6dd194d.registerClasses(loader);
 }

export function registerClasses(loader: StructClassLoader) { registerClassesSource(loader); }
