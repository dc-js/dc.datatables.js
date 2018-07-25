dc_datatables.datatable = function(selector, chartGroup) {
    var _table = {};
    var _root, _dimension, _group, _size, _columns, _sortBy, _order;
    var _dispatch = d3.dispatch('renderlet');
    _table.render = function() {
        _root = d3.select(selector);
        return _table.redraw();
    };
    _table.redraw = function() {
        var table = _root.selectAll('table').data([0]);
        table.exit().remove();
        table = table.enter()
            .append('table')
            .merge(table);
        $(table.node()).DataTable({
            data: _dimension.top(Infinity),
            columns: _table.columns().map(function(c) {
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
            })
        });
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
