## dc.datatables.js

The intent of this project is to integrate the powerful UI, styling, and plugins of
[DataTables](https://datatables.net/) with dc.js filtered data.

[Demo](https://dc-js.github.io/dc.datatables.js/) using the dc.js stock example, but with a
DataTable to display the data in a flexible way.

For now the implementation is quite simple:

* `.render()` creates the DataTable object and maps
  [columns](https://dc-js.github.io/dc.js/docs/html/dc.dataTable.html#columns__anchor) defined
  similar to those in `dc.dataTable`
* `.redraw()` pulls all the data (`.top(Infinity`) from the dimension and puts it into the
  DataTable.
* `.dt()` fetches the underlying DataTable object for further customization.

This method is much faster and more reliable than the old method of generating an HTML table using
`dc.dataTable` and then converting the DOM elements to a DataTable.

See something missing? [File an issue](https://github.com/dc-js/dc.datatables.js/issues) on this
repo, or even better, fork this project and file a pull request!
