/*!
 *  dc.datatables 0.0.3
 *  http://dc-js.github.io/dc.datatables.js/
 *  Copyright 2018 Gordon Woodhull & the dc.datatables Developers
 *  https://github.com/dc-js/dc.datatables.js/blob/master/AUTHORS
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
(function() { function _dcdt(dc) {
'use strict';

/*jshint -W079*/
var dc_datatables = {
    version: '0.0.3'
};


dc_datatables.datatable = function(selector, chartGroup) {
    var _table = {}, // this object
        _dt, // jquery.dataTables object
        _root, // selected div
        _dimension, // crossfilter dimension
        _group, _size, _columns, _sortBy, _order; // for compatibility; currently unused
    var _dispatch = d3.dispatch('renderlet');

    function columnRenderer(c) {
        switch(typeof c) {
        case 'string':
            return function(_, _2, d) {
                return d[c];
            };
            break;
        case 'function':
            return function(_, _2, d) {
                return c(d);
            };
            break;
        case 'object':
            return function(_, _2, d) {
                return c.format(d);
            };
            break;
        default:
            return null;
        };
    }

    _table.render = function() {
        _root = d3.select(selector);
        var table = _root.selectAll('table').data([0]);
        table.exit().remove();
        table = table.enter()
            .append('table')
            .merge(table);
        _dt = $(table.node()).DataTable({
            columns: _table.columns().map(function(c) {
                var col = {
                    name: typeof c === 'string' ? c : c.label,
                    type: typeof c === 'object' ? c.type : 'num',
                    render: columnRenderer(c)
                };
                col.title = col.name.charAt(0).toUpperCase() + col.name.slice(1);
                return col;
            })
        });
        return _table.redraw();
    };
    _table.redraw = function() {
        _dt.clear()
            .rows.add(_dimension.top(Infinity))
            .draw();
    };
    _table.dimension = function(_) {
        if(!arguments.length) {
            return _dimension;
        }
        _dimension = _;
        return this;
    };
    _table.group = function() { // ignored
        return this;
    };
    _table.dt = function(_) {
        if(!arguments.length) {
            return _dt;
        }
        _dt = _;
        return this;
    };
    _table.size = function(_) {
        if(!arguments.length) {
            return _size;
        }
        _size = _;
        return this;
    };
    _table.columns = function(_) {
        if(!arguments.length) {
            return _columns;
        }
        _columns = _;
        return this;
    };
    _table.sortBy = function(_) {
        if(!arguments.length) {
            return _sortBy;
        }
        _sortBy = _;
        return this;
    };
    _table.order = function(_) {
        if(!arguments.length) {
            return _order;
        }
        _order = _;
        return this;
    };
    _table.on = function(event, f) {
        if(arguments.length < 2) {
            return _dispatch.on(event);
        }
        _dispatch.on(event, f);
        return this;
    };
    dc.registerChart(_table, chartGroup);
    return _table;
};

// Expose d3 and crossfilter, so that clients in browserify
// case can obtain them if they need them.
dc_datatables.crossfilter = crossfilter;

return dc_datatables;}
    if(typeof define === "function" && define.amd) {
        define(["dc_datatables"], _dcdt);
    } else if(typeof module === "object" && module.exports) {
        var _dc = require('dc');
        module.exports = _dcdt(_dc);
    } else {
        this.dc_datatables = _dcdt(dc);
    }
}
)();

//# sourceMappingURL=dc.datatables.js.map