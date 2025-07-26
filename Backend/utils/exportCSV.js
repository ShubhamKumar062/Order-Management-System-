const { Parser } = require('json2csv');

module.exports.exportToCSV = (data, fields) => {
  try {
    const parser = new Parser({ fields });
    return parser.parse(data);
  } catch (err) {
    throw new Error('Failed to export CSV');
  }
};
