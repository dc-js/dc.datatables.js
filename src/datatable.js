dc_datatables.datatable = function(selector, chartGroup) {
    var _table = {}, // this object
        _dt, // jquery.dataTables object
        _root, // selected div
        _dimension, // crossfilter dimension
        _options, // additional options for datatables
        _columns,
        _size, _sortBy, _order; // for compatibility; currently unused
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
        _dt = jQuery(table.node()).DataTable(
            Object.assign({},
                          {
                              columns: _table.columns().map(function(c) {
                                  var col = {
                                      name: typeof c === 'string' ? c : c.label,
                                      type: typeof c === 'object' ? c.type : 'num',
                                      render: columnRenderer(c)
                                  };
                                  col.title = col.name.charAt(0).toUpperCase() + col.name.slice(1);
                                  return col;
                              })
                          },
                          _options));
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
    _table.options = function(_) {
        if(!arguments.length) {
            return _options;
        }
        _options = _;
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
