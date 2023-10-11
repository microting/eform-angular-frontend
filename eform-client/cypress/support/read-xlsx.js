const fs = require('fs');
const XLSX = require('xlsx');

const read = ({file}) => {
    const buf = fs.readFileSync(file);
    const workbook = XLSX.read(buf, { type: 'buffer' });
    return workbook
}

module.exports = {
    read,
}
