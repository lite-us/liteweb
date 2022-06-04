import LiteWeb from 'index';
import utils from 'utils';
import semver from 'semver';

export default class Plugin {

    constructor(liteWeb = false) {
        if (!liteWeb || !liteWeb instanceof LiteWeb)
            throw new Error('Expected instance of LiteWeb');
        this.liteWeb = liteWeb;
        this.pluginNoOverride = ['register'];
    }

    register(Plugin, options) {
        let pluginInterface = {
            requires: '0.0.0',
            components: {}
        }
        let result = {
            plugged: [],
            skipped: []
        }
        const plugin = new Plugin(this.liteWeb)
        if (utils.isFunction(plugin.pluginInterface)) {
            pluginInterface = plugin.pluginInterface(options)
        }
        if (semver.satisfies(LiteWeb.version, pluginInterface.requires)) {
            for (let component in pluginInterface.components) {
                if (!this.liteWeb.hasOwnProperty(component)) {
                    // TODO implement new sub-classes
                    continue
                }
                let methods = pluginInterface.components[component]
                let pluginNoOverride = this.liteWeb[component].pluginNoOverride || []
                for (let method in methods) {
                    if (method === 'constructor' || (this.liteWeb[component][method] &&
                        (pluginNoOverride.includes(method) // blacklisted methods
                            || /^_/.test(method)) // private methods
                    )) {
                        result.skipped.push(method)
                        continue
                    }
                    this.liteWeb[component][method] = methods[method].bind(this.liteWeb[component])
                    result.plugged.push(method)
                }
            }
        } else {
            throw new Error('The plugin is not compatible with this version of LiteWeb')
        }
        return result
    }
}

