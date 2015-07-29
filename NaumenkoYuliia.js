var node = require('../index');
var request = require('supertest');
var _ = require('lodash');

var templateData = [
  { id: '1', name: 'Illya Klymov', phone: '+380504020799', role: 'Administrator' },
  { id: '2', name: 'Ivanov Ivan', phone: '+380670000002', role: 'Student', strikes: 1 },
  { id: '3', name: 'Petrov Petr', phone: '+380670000001', role: 'Support', location: 'Kiev' }
];

describe('1. Incorrect answer on GET  /refreshAdmins', function() {
  it('GET /refreshAdmins', function (done) {
    request(node)
      .get('/refreshAdmins')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(200);
        done();
      });
  })
});
describe('2. Incorrect data template', function() {
  it('data template', function (done) {
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.body).toEqual(templateData);
        done();
      });
  })
});
describe('3. Incorrect reaction on request without Content-Type', function() {
  it('GET /api/users without Content-Type', function (done) {
    request(node)
      .get('/api/users')
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(401);
        done();
      });
  });
  it('GET /refreshAdmins without Content-Type', function (done) {
    request(node)
      .get('/refreshAdmins')
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(401);
        done();
      });
  });
  it('POST without Content-Type', function (done) {
    var posted = {name: 'Administrator', phone: '+380670000002', role: 'Administrator'}
    request(node)
      .post('/api/users')
      .send(JSON.stringify(posted))
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(401);
        done();
      });
  });
  it('PUT without Content-Type', function (done) {
    var puted = {id: '1', name: 'Ilusha Klimov', phone: '+380670000002', role: 'Administrator'}
    request(node)
      .put('/api/users/1')
      .send(JSON.stringify(puted))
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(401);
        done();
      });
  });
  it('DEL without Content-Type', function (done) {
    request(node)
      .del('/api/users/1')
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        done();
      });
  })
  it('POST without Content-Type: check that nothing posted to dataBase', function (done) {
    var user = {name: 'Nastenka Golubzova', phone: '+380504020799', role: 'blablabla'};
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        var userListLength = res.body.length;
        request(node)
          .post('/api/users')
          .send(user)
          .end(function (err, res) {
            request(node)
              .get('/api/users')
              .set('Content-Type', 'application/json')
              .end(function (err, res) {
                expect(res.body.length).toEqual(userListLength);
                done();
              });
          });
      });
  });
  it('PUT without Content-Type: check that nothing changed in dataBase', function (done) {
    var user = {id: '1', name: 'Nastenka Golubzova', phone: '+380504020799', role: 'Student'};
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        var userList = res.body;
        request(node)
          .put('/api/users/1')
          .send(JSON.stringify(user))
          .end(function (err, res) {
            request(node)
              .get('/api/users')
              .set('Content-Type', 'application/json')
              .end(function (err, res) {
                expect(res.body).toEqual(userList);
                done();
              });
          });
      });
  });
  it('DEL without Content-Type: check that nothing deleted', function (done) {
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        var userListLength = res.body.length;
        request(node)
          .del('/api/users/1')
          .end(function (err, res) {
            request(node)
              .get('/api/users')
              .set('Content-Type', 'application/json')
              .end(function (err, res) {
                expect(res.body.length).toEqual(userListLength);
                done();
              });
          });
      });
  });
});
describe('4. Incorrect reaction on request with incorrect Content-Type', function() {
  it('GET /api/users with incorrect Content-Type', function (done) {
    request(node)
      .get('/api/users')
      .set('Content-Type', 'text/xml')
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(401);
        done();
      });
  })
  it('GET /refreshAdmins with incorrect Content-Type', function (done) {
    request(node)
      .get('/refreshAdmins')
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(401);
        done();
      });
  });
  it('POST with incorrect Content-Type', function (done) {
    var posted = {name: 'Administrator', phone: '+380670000002', role: 'Administrator'}
    request(node)
      .post('/api/users')
      .set('Content-Type', 'text/xml')
      .send(JSON.stringify(posted))
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(401);
        done();
      });
  });
  it('PUT with incorrect Content-Type', function (done) {
    var puted = {id: '1', name: 'Ilusha Klimov', phone: '+380670000002', role: 'Administrator'}
    request(node)
      .put('/api/users/1')
      .set('Content-Type', 'text/xml')
      .send(JSON.stringify(puted))
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(401);
        done();
      });
  });
  it('DEL with incorrect Content-Type', function (done) {
    request(node)
      .del('/api/users/1')
      .set('Content-Type', 'text/xml')
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        done();
      });
  })
  it('POST with incorrect Content-Type: check that nothing posted to dataBase', function (done) {
    var user = {name: 'Super Administrator', phone: '+380504020799', role: 'Administrator'};
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        var userListLength = res.body.length;
        request(node)
          .post('/api/users')
          .set('Content-Type', 'text/xml')
          .send(JSON.stringify(user))
          .end(function (err, res) {
            request(node)
              .get('/api/users')
              .set('Content-Type', 'application/json')
              .end(function (err, res) {
                expect(res.body.length).toEqual(userListLength);
                done();
              });
          });
      });
  });
  it('PUT with incorrect Content-Type: check that nothing changed in dataBase', function (done) {
    var user = {name: 'Super Administrator', phone: '+380504020799', role: 'Administrator'};
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        var userList = res.body;
        request(node)
          .put('/api/users/1')
          .set('Content-Type', 'text/xml')
          .send(JSON.stringify(user))
          .end(function (err, res) {
            request(node)
              .get('/api/users')
              .set('Content-Type', 'application/json')
              .end(function (err, res) {
                expect(res.body).toEqual(userList);
                done();
              });
          });
      });
  });
  it('DEL with incorrect Content-Type: check that nothing deleted', function (done) {
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        var userListLength = res.body.length;
        request(node)
          .del('/api/users/1')
          .set('Content-Type', 'text/xml')
          .end(function (err, res) {
            request(node)
              .get('/api/users')
              .set('Content-Type', 'application/json')
              .end(function (err, res) {
                expect(res.body.length).toEqual(userListLength);
                done();
              });
          });
      });
  });
});
describe('5. Incorrect processing of PUT request student', function() {
  it('PUT-request student', function (done) {
    var student = {id: '2', name: 'Ivanov Vania', phone: '+380670000002', role: 'Student', strikes: 1}
    request(node)
      .put('/api/users/2')
      .set('Content-Type', 'application/json')
      .send(student)
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(204);
        done();
      });
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.body[1]).toEqual(student);
        expect(res.body[1].id).toBeDefined();
        expect(res.body[1].name).toBeDefined();
        expect(res.body[1].role).toBeDefined();
        expect(res.body[1].phone).toBeDefined();
        expect(res.body[1].strikes).toBeDefined();
        expect(res.body[1].location).not.toBeDefined();
        done();
      });
  })
  it('PUT-request student (negative test, strikes should be "1")', function (done) {
    var student = {id: '2', name: 'Ivanov Vania', phone: '+380670000002', role: 'Student'}
    request(node)
      .put('/api/users/2')
      .set('Content-Type', 'application/json')
      .send(student)
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(204);
        done();
      });
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.body[1].id).toEqual(student.id);
        expect(res.body[1].name).toEqual(student.name);
        expect(res.body[1].phone).toEqual(student.phone);
        expect(res.body[1].role).toEqual(student.role);
        expect(res.body[1].strikes).toEqual('1');


        expect(res.body[1].id).toBeDefined();
        expect(res.body[1].name).toBeDefined();
        expect(res.body[1].role).toBeDefined();
        expect(res.body[1].phone).toBeDefined();
        expect(res.body[1].location).not.toBeDefined();
        done();
      });
  })
  it('PUT-request student (negative test, location has not to be defined)', function (done) {
    var student = {id: '2', name: 'Ivanov Vania', phone: '+380670000002', role: 'Student', strikes: '1', location: 'AlmaMater'}
    request(node)
      .put('/api/users/2')
      .set('Content-Type', 'application/json')
      .send(student)
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(204);
        done();
      });
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.body[1].id).toEqual(student.id);
        expect(res.body[1].name).toEqual(student.name);
        expect(res.body[1].phone).toEqual(student.phone);
        expect(res.body[1].role).toEqual(student.role);
        expect(res.body[1].strikes).toEqual(student.strikes);


        expect(res.body[1].id).toBeDefined();
        expect(res.body[1].name).toBeDefined();
        expect(res.body[1].role).toBeDefined();
        expect(res.body[1].phone).toBeDefined();
        expect(res.body[1].location).not.toBeDefined();
        done();
      });
  })
});
describe('5. Incorrect processing of PUT request support', function() {
  it('PUT-request support', function (done) {
    var support = {id: '3', name: 'Ivanov Gosha', phone: '+380670000002', role: 'Support', location: 'Kharkow'}
    request(node)
      .put('/api/users/2')
      .set('Content-Type', 'application/json')
      .send(support)
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(204);
        done();
      });
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.body[2]).toEqual(support);
        expect(res.body[2].id).toBeDefined();
        expect(res.body[2].name).toBeDefined();
        expect(res.body[2].role).toBeDefined();
        expect(res.body[2].phone).toBeDefined();
        expect(res.body[2].location).toBeDefined();
        expect(res.body[2].strikes).not.toBeDefined();
        done();
      });
  })
  it('PUT-request support (negative test, location should be "undefined")', function (done) {
    var support = {id: '3', name: 'Ivanov Gosha', phone: '+380670000002', role: 'Support'}
    request(node)
      .put('/api/users/2')
      .set('Content-Type', 'application/json')
      .send(support)
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(204);
        done();
      });
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.body[2].id).toEqual(support.id);
        expect(res.body[2].name).toEqual(support.name);
        expect(res.body[2].phone).toEqual(support.phone);
        expect(res.body[2].role).toEqual(support.role);
        expect(res.body[2].location).toEqual('undefined');

        expect(res.body[2].id).toBeDefined();
        expect(res.body[2].name).toBeDefined();
        expect(res.body[2].role).toBeDefined();
        expect(res.body[2].phone).toBeDefined();
        expect(res.body[2].location).toBeDefined();
        expect(res.body[2].strikes).not.toBeDefined();
        done();
      });
  })
});
describe('5.1. Incorrect processing of PUT request without role', function() {
  it('PUT-request(without role)', function (done) {
    var user = { id: '2', name: 'Ivanov Vania', phone: '+380670000002', strikes: 1}
    request(node)
      .put('/api/users/2')
      .set('Content-Type', 'application/json')
      .send(user)
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(204);
        done();
      });
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.body[1].id).toEqual(user.id);
        expect(res.body[1].name).toEqual(user.name);
        expect(res.body[1].phone).toEqual(user.phone);
        expect(res.body[1].role).toEqual('Student');
        expect(res.body[1].strikes).toEqual(user.strikes);

        expect(res.body[1].id).toBeDefined();
        expect(res.body[1].name).toBeDefined();
        expect(res.body[1].phone).toBeDefined();
        expect(res.body[1].role).toBeDefined();
        expect(res.body[1].strikes).toBeDefined();

        expect(res.body[1].location).not.toBeDefined();
        done();
      });
  })
  it('PUT-request(with empty role)', function (done) {
    var user = { id: '2', role:'', name: 'Ivanov Vania', phone: '+380670000002', strikes: 1 }
    request(node)
      .put('/api/users/2')
      .set('Content-Type', 'application/json')
      .send(user)
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(204);
        done();
      });
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.body[1].id).toEqual(user.id);
        expect(res.body[1].name).toEqual(user.name);
        expect(res.body[1].phone).toEqual(user.phone);
        expect(res.body[1].role).toEqual('Student');
        expect(res.body[1].strikes).toEqual(user.strikes);

        expect(res.body[1].id).toBeDefined();
        expect(res.body[1].name).toBeDefined();
        expect(res.body[1].phone).toBeDefined();
        expect(res.body[1].role).toBeDefined();
        expect(res.body[1].strikes).toBeDefined();

        expect(res.body[1].location).not.toBeDefined();
        done();
      });
  })
  it('if PUT-request is almost empty (with empty role)', function (done) {
    var user = {id: 2}
    request(node)
      .put('/api/users/2')
      .set('Content-Type', 'application/json')
      .send(user)
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(204);
        done();
      });
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.body[1].id).toEqual(user.id);
        expect(res.body[1].name).toEqual('Empty');
        expect(res.body[1].phone).toEqual('Empty');
        expect(res.body[1].role).toEqual('Student');
        expect(res.body[1].strikes).toEqual('1');

        expect(res.body[1].id).toBeDefined();
        expect(res.body[1].name).toBeDefined();
        expect(res.body[1].phone).toBeDefined();
        expect(res.body[1].role).toBeDefined();
        expect(res.body[1].strikes).toBeDefined();

        expect(res.body[1].location).not.toBeDefined();
        done();
      });
  })
});
describe('6. Incorrect processing of PUT request(admin)', function() {
  it('PUT request(admin)', function (done) {
    var admin = {id: '1', name: 'Ilusha Klymov', phone: '+380504020799', role: 'Administrator'};
    request(node)
      .put('/api/users/1')
      .set('Content-Type', 'application/json')
      .send(admin)
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(204);
        done();
      });
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.body[0]).toEqual(admin);
        expect(res.body[0].id).toBeDefined();
        expect(res.body[0].name).toBeDefined();
        expect(res.body[0].role).toBeDefined();
        expect(res.body[0].phone).toBeDefined();
        expect(res.body[0].strikes).not.toBeDefined();
        expect(res.body[0].location).not.toBeDefined();
        done();
      });
  })
  it('PUT request(admin) (negative test, location and strikes must have been not found', function (done) {
    var admin = {id: '1', name: 'Ilusha Klymov', phone: '+380504020799', role: 'Administrator', location: 'Moskow', strikes: '2'};
    request(node)
      .put('/api/users/1')
      .set('Content-Type', 'application/json')
      .send(admin)
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(204);
        done();
      });
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.body[0].name).toEqual(admin.name);
        expect(res.body[0].role).toEqual(admin.role);
        expect(res.body[0].phone).toEqual(admin.phone);

        expect(res.body[0].id).toBeDefined();
        expect(res.body[0].name).toBeDefined();
        expect(res.body[0].role).toBeDefined();
        expect(res.body[0].phone).toBeDefined();
        expect(res.body[0].strikes).not.toBeDefined();
        expect(res.body[0].location).not.toBeDefined();
        done();
      });
  })
  it('PUT request(admin) (negative test, name and role must have been added automatically', function (done) {
    var admin = {id: '1', role: 'Administrator'};
    request(node)
      .put('/api/users/1')
      .set('Content-Type', 'application/json')
      .send(admin)
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(204);
        done();
      });
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.body[0].name).toEqual('Empty');
        expect(res.body[0].role).toEqual(admin.role);
        expect(res.body[0].phone).toEqual('Empty');

        expect(res.body[0].id).toBeDefined();
        expect(res.body[0].name).toBeDefined();
        expect(res.body[0].role).toBeDefined();
        expect(res.body[0].phone).toBeDefined();
        expect(res.body[0].strikes).not.toBeDefined();
        expect(res.body[0].location).not.toBeDefined();
        done();
      });
  })
});
describe('7. Incorrect processing of incorrect PUT request', function() {
  it('incorrect PUT request', function (done) {
    var user = {id: '-1', name: 'Vasia Golubzov', phone: '+380504020799', role: 'Student', strikes: 1};
    request(node)
      .put('/api/users/-1')
      .set('Content-Type', 'application/json')
      .send(user)
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(404);
        done();
      });
  });
  it('PUT with incorrect Content-Type: check that nothing changed in dataBase', function (done) {
    var user = {name: 'Super Administrator', phone: '+380504020799', role: 'Administrator'};
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        var userList = res.body;
        request(node)
          .put('/api/users/1')
          .set('Content-Type', 'text/xml')
          .send(JSON.stringify(user))
          .end(function (err, res) {
            request(node)
              .get('/api/users')
              .set('Content-Type', 'application/json')
              .end(function (err, res) {
                expect(res.body).toEqual(userList);
                done();
              });
          });
      });
  });
});
describe('8. Incorrect processing of DELETE', function() {
  it('processing of DELETE', function (done) {
    request(node)
      .del('/api/users/1')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(204);
        done();
      });
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.body[0].id).not.toEqual('1');
        done();
      });
  })
});
describe('9. Incorrect processing of incorrect DELETE', function() {
  it('processing of incorrect DELETE', function (done) {
    request(node)
      .del('/api/users/-2')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(404);
        done();
      });
  })
  it('check that nothing deleted', function (done) {
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        var userListLength = res.body.length;
        request(node)
          .del('/api/users/-5')
          .set('Content-Type', 'application/json')
          .end(function (err, res) {
            request(node)
              .get('/api/users')
              .set('Content-Type', 'application/json')
              .end(function (err, res) {
                expect(res.body.length).toEqual(userListLength);
                done();
              });
          });
      });
  });
});
describe('10. Incorrect POST processing of incorrect role', function() {
  it('POST with incorrect role', function (done) {
    var user = { name: 'Nastenka Golubzova', phone: '+380504020799', role: 'blablabla'};
    request(node)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(user)
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(401);
        done();
      });
  })
  it('check that nothing posted to dataBase', function (done) {
    var user = { name: 'Nastenka Golubzova', phone: '+380504020799', role: 'blablabla'};
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        var userListLength = res.body.length;
        request(node)
          .post('/api/users')
          .set('Content-Type', 'application/json')
          .send(user)
          .end(function (err, res) {
            request(node)
              .get('/api/users')
              .set('Content-Type', 'application/json')
              .end(function (err, res) {
                expect(res.body.length).toEqual(userListLength);
                done();
              });
          });
      });
  });
});
describe('11.1. Incorrect POST processing of student creation', function() {
  it('processing of student creation', function (done) {
    var user = {name: 'Ivanov Vania', role:'', phone: '+380670000002', strikes: '1'}
    request(node)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(user)
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(200);
        done();
      });
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.body[res.body.length - 1].id).toBeDefined();
        expect(res.body[res.body.length - 1].name).toBeDefined();
        expect(res.body[res.body.length - 1].role).toBeDefined();
        expect(res.body[res.body.length - 1].phone).toBeDefined();
        expect(res.body[res.body.length - 1].strikes).toBeDefined();

        expect(res.body[res.body.length - 1].name).toEqual(user.name);
        expect(res.body[res.body.length - 1].phone).toEqual(user.phone);
        expect(res.body[res.body.length - 1].role).toEqual('Student');
        expect(res.body[res.body.length - 1].strikes).toEqual(user.strikes);

        expect(res.body[res.body.length - 1].location).not.toBeDefined();

        done();
      });
  })
})
describe('11.2 Incorrect  POST processing of request without role', function() {
  it('POST without role', function (done) {
    var user = {name: 'Ivanov Vania', phone: '+380670000002', strikes: '1'}
    request(node)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(user)
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(200);
        done();
      });
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.body[res.body.length - 1].id).toBeDefined();
        expect(res.body[res.body.length - 1].name).toBeDefined();
        expect(res.body[res.body.length - 1].role).toBeDefined();
        expect(res.body[res.body.length - 1].phone).toBeDefined();
        expect(res.body[res.body.length - 1].strikes).toBeDefined();

        expect(res.body[res.body.length - 1].name).toEqual(user.name);
        expect(res.body[res.body.length - 1].phone).toEqual(user.phone);
        expect(res.body[res.body.length - 1].role).toEqual('Student');
        expect(res.body[res.body.length - 1].strikes).toEqual(user.strikes);

        expect(res.body[res.body.length - 1].location).not.toBeDefined();
        done();
      });
  })
  it('POST with empty role (without role)', function (done) {
    var user = {name: 'Ivanov Vania', role:'', phone: '+380670000002', strikes: '1'}
    request(node)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(user)
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(200);
        done();
      });
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.body[res.body.length - 1].id).toBeDefined();
        expect(res.body[res.body.length - 1].name).toBeDefined();
        expect(res.body[res.body.length - 1].role).toBeDefined();
        expect(res.body[res.body.length - 1].phone).toBeDefined();
        expect(res.body[res.body.length - 1].strikes).toBeDefined();

        expect(res.body[res.body.length - 1].name).toEqual(user.name);
        expect(res.body[res.body.length - 1].phone).toEqual(user.phone);
        expect(res.body[res.body.length - 1].role).toEqual('Student');
        expect(res.body[res.body.length - 1].strikes).toEqual(user.strikes);

        expect(res.body[res.body.length - 1].location).not.toBeDefined();
        done();
      });
  })
  it('POST with empty object (without role)', function (done) {
    var user = {}
    request(node)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(user)
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(200);
        done();
      });
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.body[res.body.length - 1].id).toBeDefined();

        expect(res.body[res.body.length - 1].role).toEqual('Student');
        expect(res.body[res.body.length - 1].name).toEqual('Empty');
        expect(res.body[res.body.length - 1].phone).toEqual('Empty');
        expect(res.body[res.body.length - 1].strikes).toEqual('1');

        expect(res.body[res.body.length - 1].location).not.toBeDefined();
        done();
      });
  })
});
describe('12. Incorrect POST processing of admin creation', function() {
  it('POST processing of admin creation', function (done) {
    var admin = {role: 'Administrator', name: 'Nachalnika', phone: '+380670000002'};
    request(node)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(admin)
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(200);
        done();
      });
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.body[res.body.length - 1].id).toBeDefined();
        expect(res.body[res.body.length - 1].name).toBeDefined();
        expect(res.body[res.body.length - 1].role).toBeDefined();
        expect(res.body[res.body.length - 1].phone).toBeDefined();

        expect(res.body[res.body.length - 1].name).toEqual(admin.name);
        expect(res.body[res.body.length - 1].phone).toEqual(admin.phone);
        expect(res.body[res.body.length - 1].role).toEqual(admin.role);

        expect(res.body[res.body.length - 1].strikes).not.toBeDefined();
        expect(res.body[res.body.length - 1].location).not.toBeDefined();
        done();
      });
  })
  it('POST processing of admin creation(negative test, location should be undefined)', function (done) {
    var admin = {role: 'Administrator', name: 'Nachalnika', phone: '+380670000002', location: 'Bora-Bora'};
    request(node)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(admin)
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(200);
        done();
      });
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.body[res.body.length - 1].id).toBeDefined();
        expect(res.body[res.body.length - 1].name).toBeDefined();
        expect(res.body[res.body.length - 1].role).toBeDefined();
        expect(res.body[res.body.length - 1].phone).toBeDefined();

        expect(res.body[res.body.length - 1].name).toEqual(admin.name);
        expect(res.body[res.body.length - 1].phone).toEqual(admin.phone);
        expect(res.body[res.body.length - 1].role).toEqual(admin.role);

        expect(res.body[res.body.length - 1].strikes).not.toBeDefined();
        expect(res.body[res.body.length - 1].location).not.toBeDefined();
        done();
      });
  })
});
describe('13. Incorrect POST processing of support creation', function() {
    it('processing of support creation', function (done) {
    var support = { role: 'Support', name: 'Pomoshnika', phone: '+380637023703', location: 'Kharkow'};
    request(node)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(support)
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(200);
        done();
      });
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.body[res.body.length - 1].id).toBeDefined();
        expect(res.body[res.body.length - 1].name).toBeDefined();
        expect(res.body[res.body.length - 1].role).toBeDefined();
        expect(res.body[res.body.length - 1].phone).toBeDefined();
        expect(res.body[res.body.length - 1].location).toBeDefined();

        expect(res.body[res.body.length - 1].name).toEqual(support.name);
        expect(res.body[res.body.length - 1].phone).toEqual(support.phone);
        expect(res.body[res.body.length - 1].role).toEqual(support.role);
        expect(res.body[res.body.length - 1].location).toEqual(support.location);

        expect(res.body[res.body.length - 1].strikes).not.toBeDefined();
        done();
      });
  })
  it('processing of support creation (negative test, location should be added', function (done) {
    var support = { role: 'Support', name: 'Pomoshnika', phone: '+380637023703'};
    request(node)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(support)
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(200);
        done();
      });
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.body[res.body.length - 1].id).toBeDefined();
        expect(res.body[res.body.length - 1].name).toBeDefined();
        expect(res.body[res.body.length - 1].role).toBeDefined();
        expect(res.body[res.body.length - 1].phone).toBeDefined();
        expect(res.body[res.body.length - 1].location).toBeDefined();

        expect(res.body[res.body.length - 1].name).toEqual(support.name);
        expect(res.body[res.body.length - 1].phone).toEqual(support.phone);
        expect(res.body[res.body.length - 1].role).toEqual(support.role);
        expect(res.body[res.body.length - 1].location).toEqual('undefined');

        expect(res.body[res.body.length - 1].strikes).not.toBeDefined();
        done();
      });
  })
  it('processing of support creation (negative test, strikes should be undefined', function (done) {
    var support = { role: 'Support', name: 'Pomoshnika', phone: '+380637023703', location: 'Kharkow', strikes: '3'};
    request(node)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(support)
      .end(function (err, res) {
        expect(res.headers['content-type']).toMatch('application/json');
        expect(res.statusCode).toBe(200);
        done();
      });
    request(node)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.body[res.body.length - 1].id).toBeDefined();
        expect(res.body[res.body.length - 1].name).toBeDefined();
        expect(res.body[res.body.length - 1].role).toBeDefined();
        expect(res.body[res.body.length - 1].phone).toBeDefined();
        expect(res.body[res.body.length - 1].location).toBeDefined();

        expect(res.body[res.body.length - 1].name).toEqual(support.name);
        expect(res.body[res.body.length - 1].phone).toEqual(support.phone);
        expect(res.body[res.body.length - 1].role).toEqual(support.role);
        expect(res.body[res.body.length - 1].location).toEqual(support.location);

        expect(res.body[res.body.length - 1].strikes).not.toBeDefined();
        done();
      });
  })
});
