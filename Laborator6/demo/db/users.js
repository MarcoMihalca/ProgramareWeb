var records = [
  { id: 1, username: 'mona', password: 'secret', displayName: 'Simona', emails: [ { value: 'mona@example.com' } ] },
  { id: 2, username: 'radu', password: 'proweb', displayName: 'Raducu', emails: [ { value: 'radu@example.com' } ] }
];

exports.authenticate = function(username) {
  for (var i = 0, len = records.length; i < len; i++) {
    var record = records[i];
    if (record.username === username) {
      return record;
    }
  }
  return null;
};