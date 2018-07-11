// Expose d3 and crossfilter, so that clients in browserify
// case can obtain them if they need them.
dc.crossfilter = crossfilter;

return dc;}
    if(typeof define === "function" && define.amd) {
        define(["dc"], _dcdt);
    } else if(typeof module === "object" && module.exports) {
        var _dc = require('dc');
        // When using npm + browserify, 'crossfilter' is a function,
        // since package.json specifies index.js as main function, and it
        // does special handling. When using bower + browserify,
        // there's no main in bower.json (in fact, there's no bower.json),
        // so we need to fix it.
        if (typeof _crossfilter !== "function") {
            _crossfilter = _crossfilter.crossfilter;
        }
        module.exports = _dcdt(_d3, _crossfilter);
    } else {
        this.dc = _dcdt(d3, crossfilter);
    }
}
)();
