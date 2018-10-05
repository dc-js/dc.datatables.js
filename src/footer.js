// Expose dc; clients can retrieve d3 & crossfilter from dc if needed
dc_datatables.dc = dc;

return dc_datatables;}
    if(typeof define === "function" && define.amd) {
        define(["d3", "dc"], _dcdt);
    } else if(typeof module === "object" && module.exports) {
        var _d3 = require('d3');
        var _dc = require('dc');
        module.exports = _dcdt(_d3, _dc);
    } else {
        this.dc_datatables = _dcdt(d3, dc);
    }
}
)();
