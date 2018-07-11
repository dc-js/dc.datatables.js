dc_datatables.datatable = function(selector, chartGroup) {
    var _table = {};
    var _root, _dimension;
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
            data: _dimension.top(Infinity)
        });
    };
    _table.dimension = function(_) {
        if(!arguments.length) {
            return _dimension;
        }
        _dimension = _;
        return this;
    };
    dc.registerChart(_table, chartGroup);
    return _table;
};
