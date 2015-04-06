// Table Cell

var Cell = new Class({
    initialize: function (key, row) {
        this.key = key;
        this.row = row;
    },

    toElement: function () {
        return this.elem;
    },

    getKey: function () {
        return this.key;
    },

    getRow: function () {
        return this.row;
    },

    getData: function () {
        return this.getRow().getData()[this.getKey()];
    },

    render: function () {
        this.elem = new Element('td', {
            html: this.getData()
        });

        $(this.row).appendChild(this.elem);
    }
});

var Row = new Class({
    cells: [],

    initialize: function (rowIndex, table) {
        var Ctor = this.getCellClass();
        this.rowIndex = rowIndex;
        this.table = table;

        Object.each(this.getData(), function (value, key) {
            this.cells.push(new Ctor(key, this));
        }, this);
    },

    toElement: function () {
        return this.elem;
    },

    getData: function () {
        return this.getTable().getData()[this.rowIndex];
    },

    getTable: function () {
        return this.table;
    },

    getCellClass: function(){
        return Cell;
    },

    getRenderDest: function() {
        return this.getTable().getBody();
    },

    render: function () {
        this.elem = new Element('tr');

        this.cells.each(function (cell) {
            cell.render();
        });

        this.getRenderDest().appendChild(this.elem);
    }
});

var HeaderCell = new Class({
    Extends: Cell,

    render: function () {
        this.parent();

        $(this).addEvent('click', this.handleClick.bind(this));
    },

    handleClick: function (e) {
        this.getRow().getTable().sort(this.getKey()).render();
    }
});

var HeaderRow = new Class({
    Extends: Row,

    initialize: function (cells, table) {
        this.headerCells = cells.associate(cells);
        this.parent(undefined, table);

    },

    getData: function () {
        return this.headerCells;
    },

    getCellClass: function(){
        return HeaderCell;
    },

    getRenderDest: function() {
        return this.getTable().getHead();
    }
});

var Table = new Class({
    rows: [],
    header: undefined,

    initialize: function (data) {
        var headers = [];

        this.elem = new Element('table', {
            class: 'table table-hover table-responsive',
            html: '<thead></thead><tbody></tbody>'
        });

        this.data = data;
     
        this.data.each(function (datum, i) {
            this.rows.push(new Row(i, this));
            headers.combine(Object.keys(datum));
        }, this);

        this.header = new HeaderRow(headers, this);

        this.elem.parentNode === null && document.body.appendChild(this.elem);

        this.render();
    },

    getData: function () {
        return this.data;
    },

    getHead: function () {
        return this.elem.getElement('thead');
    },

    getBody: function () {
        return this.elem.getElement('tbody');
    },

    sort: function (key) {

        this.data.sort(function (row1, row2) {
            var val1 = row1[key],
                val2 = row2[key];

            if (!val1 || !val2) {
                return 0;
            }

            return val1.toString().localeCompare(val2.toString());
        });

        return this;
    },

    render: function () {
        this.getBody().empty();

        this.rows.each(function (row) {
            row.render();
        });

        this.getHead().empty();

        this.header.render();
    }
});

var data = [{
        "id": 1,
        "gender": "M",
        "first": "John",
        "last": "Smith",
        "city": "Seattle, WA",
        "status": "Active"
    }, {
        "id": 2,
        "gender": "F",
        "first": "Kelly",
        "last": "Ruth",
        "city": "Dallas, TX",
        "status": "Active"
    }, {
        "id": 3,
        "gender": "M",
        "first": "Jeff",
        "last": "Stevenson",
        "city": "Washington, D.C.",
        "status": "Active"
    }, {
        "id": 4,
        "gender": "F",
        "first": "Jennifer",
        "last": "Gill",
        "city": "Seattle, WA",
        "status": "Inactive"
    }];

var table = new Table(data);












