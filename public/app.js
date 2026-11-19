
const createTableBtn = document.getElementById('createTableBtn');
const createTableModal = document.getElementById('createTableModal');
const closeTableModal = document.getElementById('closeTableModal');

const addColumnBtn = document.getElementById('addColumnBtn');
const columns = document.getElementById('columns');
const submitTableBtn = document.getElementById('submitTableBtn');

const addRecordBtn = document.getElementById('addRecordBtn');
const addRecordModal = document.getElementById('addRecordModal');
const closeRecordModal = document.getElementById('closeRecordModal');

const tableList = document.getElementById('tableList');
const tableHeading = document.getElementById('tableHeading');
const tableContainer = document.getElementById('tableContainer');
const recordFields = document.getElementById('recordFields');

let selectedTable = null;
let selectedColumns = [];

// Open Create Table Modal

createTableBtn.addEventListener('click', () => {
    createTableModal.style.display = 'flex';

    if (columns.children.length === 0) {
        addColumn();
    }
});

// Close Create Table Modal

closeTableModal.addEventListener('click', () => {
    createTableModal.style.display = 'none';
});

// Add Field

function addColumn() {
    const column = document.createElement('div');

    column.className = 'column';

    column.innerHTML = `
        <input type="text" placeholder="Field name">

        <select>
            <option value="STRING">STRING</option>
            <option value="INTEGER">INTEGER</option>
            <option value="FLOAT">FLOAT</option>
        </select>
    `;

    columns.appendChild(column);
}

addColumnBtn.addEventListener('click', addColumn);

// Create Table

submitTableBtn.addEventListener('click', async () => {
    const tableName = document.getElementById('tableName').value.trim();

    const columnInputs = document.querySelectorAll('.column');

    const columnsData = [];

    columnInputs.forEach((column) => {
        const name = column.querySelector('input').value.trim();
        const type = column.querySelector('select').value;

        if (name !== '') {
            columnsData.push({
                name: name,
                type: type
            });
        }
    });

    if (tableName === '') {
        alert('Please enter table name');
        return;
    }

    if (columnsData.length === 0) {
        alert('Please enter at least one field');
        return;
    }

    try {
        const response = await axios.post('/tables/create-table', {
            tableName: tableName,
            columns: columnsData
        });

        alert(response.data.message);

        addTableToSidebar(tableName, columnsData);

        createTableModal.style.display = 'none';

        document.getElementById('tableName').value = '';
        columns.innerHTML = '';

    } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || 'Unable to create table');
    }
});

// Add Table to Sidebar

function addTableToSidebar(tableName, tableColumns) {
    const tableItem = document.createElement('div');

    tableItem.className = 'table-item';
    tableItem.innerText = tableName;

    tableItem.addEventListener('click', async () => {
        selectedTable = tableName;
        selectedColumns = tableColumns;

        tableHeading.innerText = tableName;
        tableContainer.innerHTML = '';

        addRecordBtn.style.display = 'inline-block';

        try {
            const response = await axios.get(`/tables/get-records/${tableName}`);

            displayRecords(response.data);

        } catch (error) {
            console.log(error);
            alert('Unable to fetch records');
        }
    });

    tableList.appendChild(tableItem);
}

// Display Records

function displayRecords(records) {
    if (records.length === 0) {
        tableContainer.innerHTML = '<p>No records found</p>';
        return;
    }

    const table = document.createElement('table');

    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');

    Object.keys(records[0]).forEach((key) => {
        const th = document.createElement('th');
        th.innerText = key;
        headerRow.appendChild(th);
    });

    const actionHeading = document.createElement('th');
    actionHeading.innerText = 'Action';
    headerRow.appendChild(actionHeading);

    thead.appendChild(headerRow);

    records.forEach((record) => {
        const row = document.createElement('tr');

        Object.keys(record).forEach((key) => {
            const td = document.createElement('td');
            td.innerText = record[key] ?? '';
            row.appendChild(td);
        });

        const actionTd = document.createElement('td');

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete';

        deleteBtn.addEventListener('click', async () => {
            await deleteRecord(record.id);
        });

        actionTd.appendChild(deleteBtn);
        row.appendChild(actionTd);

        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);

    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
}

// Add Record Modal

addRecordBtn.addEventListener('click', () => {
    if (selectedTable === null) {
        alert('Please select a table first');
        return;
    }

    recordFields.innerHTML = '';

    selectedColumns.forEach((column) => {
        const field = document.createElement('div');

        field.className = 'record-field';

        field.innerHTML = `
            <input type="text" placeholder="${column.name}">
        `;

        recordFields.appendChild(field);
    });

    addRecordModal.style.display = 'flex';
});

// Close Add Record Modal

closeRecordModal.addEventListener('click', () => {
    addRecordModal.style.display = 'none';
});

// Close modal if background is clicked

createTableModal.addEventListener('click', (event) => {
    if (event.target === createTableModal) {
        createTableModal.style.display = 'none';
    }
});

addRecordModal.addEventListener('click', (event) => {
    if (event.target === addRecordModal) {
        addRecordModal.style.display = 'none';
    }
});

// Fetch Tables

async function loadTables() {
    try {
        const response = await axios.get('/tables/get-tables');

        const tables = response.data;

        tables.forEach((table) => {
            addTableToSidebar(table.tableName, table.columns);
        });

    } catch (error) {
        console.log(error);
    }
}

loadTables();

// Add Record

const submitRecordBtn = document.getElementById('submitRecordBtn');

submitRecordBtn.addEventListener('click', async () => {
    const inputs = recordFields.querySelectorAll('input');
    const record = {};

    selectedColumns.forEach((column, index) => {
        record[column.name] = inputs[index].value;
    });

    try {
        const response = await axios.post(
            `/tables/add-record/${selectedTable}`,
            record
        );

        alert(response.data.message);

        addRecordModal.style.display = 'none';

        const recordsResponse = await axios.get(
            `/tables/get-records/${selectedTable}`
        );

        displayRecords(recordsResponse.data);

    } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || 'Unable to add record');
    }
});

// Delete Record

async function deleteRecord(id) {
    try {
        await axios.delete(
            `/tables/delete-record/${selectedTable}/${id}`
        );

        const recordsResponse = await axios.get(
            `/tables/get-records/${selectedTable}`
        );

        displayRecords(recordsResponse.data);

    } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || 'Unable to delete record');
    }
}
