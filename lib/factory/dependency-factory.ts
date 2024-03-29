import { 
    _INJECTABLE_DECORATOR_META_KEY, 
    _CONTROLLER_DECORATOR_META_KEY, 
    InjectableMetadata,
    ControllerMetadata,
    DependencyClass, 
    ControllerClass
} from '../main/metadata.ts';
import { ControllerBase } from '../main/controller.ts';
import { Logger } from '../main/logger.ts';
import 'https://deno.land/x/reflection@0.0.2/mod.ts';

/**
 * Creates instances of injectable dependencies to be auto-injected
 * where needed at runtime
 */
export class DependencyFactory {
    private dependencies: Record<string, DependencyClass> = {};
    private singletons: Record<string, any> = {};

    /**
     * @param dependencyClasses List of injectable dependencies
     */
    constructor(dependencyClasses: Array<DependencyClass>) {
        this.reserveDependencies(dependencyClasses);
    }

    private reserveDependencies(dependencyClasses: Array<DependencyClass>) {
        for (const dependencyClass of dependencyClasses) {
            this.dependencies[dependencyClass.name] = dependencyClass;
        }
    }

    private createDependencyInstance(dependencyClass: DependencyClass): any {
        const name = dependencyClass.name;
        const dependency = this.singletons[name] || this.dependencies[name];

        if (!dependency) {
            Logger.queue(`Dependency not injected: '${name}'`, 'error');
            return;
        }
        else if (name in this.singletons) {
            return dependency;
        }

        const metadata: InjectableMetadata | undefined = Reflect.getMetadata(_INJECTABLE_DECORATOR_META_KEY, dependencyClass);
        if (!metadata) {
            Logger.queue(`Dependency not marked as Injectable: '${name}'`, 'error');
            return;
        }

        const params = [];
        for (const paramClass of metadata.params) {
            params.push(this.createDependencyInstance(paramClass));
        }

        const instance: any = new dependency(...params);
        if (metadata.singleton) {
            this.singletons[name] = instance;
        }
        return instance;
    }
    
    /**
     * Creates instances for all controller classes, creating injectable 
     * dependency instances where needed.
     * 
     * @param controllerClasses List of controller classes
     * @returns List of controller instances created as singletons using 
     * the given {@link controllerClasses}.
     */
    createControllers(controllerClasses: Array<ControllerClass>): Array<ControllerBase> {
        const controllerInstances: Array<ControllerBase> = [];

        for (const controllerClass of controllerClasses) {
            const metadata: ControllerMetadata | undefined = Reflect.getMetadata(_CONTROLLER_DECORATOR_META_KEY, controllerClass);
            if (!metadata) {
                Logger.queue(`Dependency not marked as Controller: '${controllerClass.name}'`, 'error');
                continue;
            }
            
            const params = [];
            for (const paramClass of metadata.params) {
                params.push(this.createDependencyInstance(paramClass));
            }
            controllerInstances.push(new controllerClass(...params));
        }
        return controllerInstances;
    }
}