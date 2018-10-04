// Expose d3 and crossfilter, so that clients in browserify
// case can obtain them if they need them.
dc_datatables.crossfilter = crossfilter;

return dc_datatables;}
    if(typeof define === "function" && define.amd) {
        define([], _dcdt);
    } else if(typeof module === "object" && module.exports) {
        var _dc = require('dc');
        module.exports = _dcdt(_dc);
    } else {
        this.dc_datatables = _dcdt(dc);
    }
}
)();
