## dc.datatables.js

NOTE: This library is archived, as it was an incomplete demo and I (Gordon) have moved on. If you are interested in reviving and maintaining this library in the dc-js organization, please reach out to me via my email in bio.

The intent of this project is to integrate the powerful UI, styling, and plugins of
[DataTables](https://datatables.net/) with dc.js filtered data.

[Demo](https://dc-js.github.io/dc.datatables.js/) using the dc.js stock example, but displaying the
data with a DataTable.

**NOTE**: [dc-tableview](https://github.com/karenpommeroy/dc-tableview) has a lot more features than
this library, check it out!

Instead of generating an HTML table using `dc.dataTable` and then converting the DOM elements to a
DataTable, use `dc.datatables.js` to import the data programmatically. This should be faster and
less error-prone.

Implementation:

* `.render()` creates the DataTable object and maps
  [columns](https://dc-js.github.io/dc.js/docs/html/dc.dataTable.html#columns__anchor) defined
  similar to those in `dc.dataTable`
* `.redraw()` pulls all the data (`.top(Infinity`) from the dimension and puts it into the
  DataTable using [rows.add()](https://datatables.net/reference/api/rows.add())
* `.dt()` fetches the underlying DataTable object for further customization.

For control over column formatting and behavior, use the object form of columns

* [columns.type](https://datatables.net/reference/option/columns.type), used for sorting, is 'num'
  by default; use `type` to override this
* [columns.name](https://datatables.net/reference/option/columns.name), used as a unique id, is read
  from the `label`
* [columns.title](https://datatables.net/reference/option/columns.title), used to provide heading
  text, is read from the `label` and capitalized
* [columns.render](https://datatables.net/reference/option/columns.render), used to fetch and format
  the data, uses the function `format`

In limited cases, you can also use the string form of columns. This will read the field with that
name, use the default numeric ordering

See something missing? [File an issue](https://github.com/dc-js/dc.datatables.js/issues) on this
repo, or even better, fork this project and file a pull request!
