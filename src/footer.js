// Expose dc; clients can retrieve d3 & crossfilter from dc if needed
dc_datatables.dc = dc;

return dc_datatables;}
    if(typeof define === "function" && define.amd) {
        define(["d3", "dc", "jquery", "datatables"], _dcdt);
    } else if(typeof module === "object" && module.exports) {
        var _d3 = require('d3');
        var _dc = require('dc');
        var _jQuery = require('jquery');
        var _datatables = require('datatables');
        module.exports = _dcdt(_d3, _dc, _jQuery, _datatables);
    } else {
        this.dc_datatables = _dcdt(d3, dc, $, $); // datatables has no symbol of its own (?)
    }
}
)();
