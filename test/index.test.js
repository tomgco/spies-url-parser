var assert = require('assert');
var fixtures = require('./fixtures.json');
// var urls = require('./fixtures.json').urls;
// var airports = require('./fixtures.json').airports;
// var all_destinations = require('./fixtures.json').all_destinations;
// console.log(urls);

var parse = require('../');

describe('make_birthday', function () {
  it('Returns a Temporary birthday date for a given age', function (done) {
    var age = '21';

    var today = new Date();
    var Y = today.getFullYear() - parseInt(age, 10); // subtract age (in years)
    var M = today.getMonth();
    var D = today.getDate();
    var expected = '' + Y + '-' + M + '-' + D; // e.g: 1995-05-11
    console.log('   expected:', expected);
    var birthday = parse.make_birthday(age);

    assert.equal(birthday, expected);
    done();
  });
});

describe('Parse departure_airport_name from int to human-readable', function () {
  it('Returns København - CPH for 12678', function (done) {
    var expected = 'København - CPH';
    var airport_name = parse.departure_airport_name(12678);
    assert.equal(expected, airport_name);
    done();
  });

  it('Check the correct airport is returned for each code', function (done) {
    Object.keys(fixtures.airports).forEach(function (k) {
      var expected = fixtures.airports[k];
      var airport_name = parse.departure_airport_name(parseInt(k, 10));
      // console.log(expected, airport_name);
      assert.equal(expected, airport_name);
    });
    done();
  });

  it('Returns default København - CPH', function (done) {
    var expected = 'København - CPH';
    var airport_name = parse.departure_airport_name(); // no airport code
    assert.equal(expected, airport_name);
    done();
  });
});

describe('Parse Passenger Mix from QueryRoomAges URL Query Parameter', function () {
  it('gets passenger mix (birthdays) from QueryRoomAges', function (done) {
    var query = parse.parse_url(fixtures.urls[0]);
    var pax_mix = parse.parse_passenger_mix(query.QueryRoomAges);
    // console.log(pax_mix);
    assert.equal(pax_mix.adults, 2);
    done();
  });

  it('Parses edge case unusual value: &QueryUnits=1#h1=prilo ...', function (done) {
    var query = parse.parse_url(fixtures.urls[5]);
    var pax_mix = parse.parse_passenger_mix(query.QueryRoomAges);
    assert.equal(pax_mix.children, 3);
    done();
  });
});

describe('Parses the Query string of a Spies.dk url', function () {
  it('Parse departure date', function (done) {
    var q = parse.parse_url(fixtures.urls[0]);
    assert(q.QueryDepDate = '20160701');
    done();
  });

  it('Parse departure date', function (done) {
    var q = parse.parse_url(fixtures.urls[0]);
    var date = parse.parse_date_string(q.QueryDepDate);
    // console.log(date);
    assert.equal(date, '2016-07-01');
    done();
  });
});

describe('Complete parsed object', function () {
  it('parsed object ready for setting options in React UI', function (done) {
    var result = parse(fixtures.urls[0]);
    // console.log(JSON.stringify(result, null, 2));
    assert.deepEqual(result, fixtures.all_destinations);
    done();
  });

  it('parsed object ready for setting options in React UI', function (done) {
    var result = parse(fixtures.urls[6]);
    // console.log(JSON.stringify(result, null, 2));
    assert.deepEqual(result, fixtures.grand_canaria);
    done();
  });
});

describe('Degrade Gracefully if the referrer URL is not from Spies.dk', function () {
  it('Dont attempt to parse a url that does not contain the params', function (done) {
    var result = parse('example.com');
    // console.log(JSON.stringify(result, null, 2));
    assert.deepEqual(result, {});
    done();
  });
});
