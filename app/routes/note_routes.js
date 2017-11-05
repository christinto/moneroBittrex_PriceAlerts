// routes/note_routes.js
//could also use request-promise library here instead of request

var request = require('request');

module.exports = function(app, db) {

  const createLatestPriceResponse = (spotPrice, lastPrices, res) => {
      //spot price and lastPrices both show full json body of bid, ask and spot.
      var response = {
        currentPrices: spotPrice,
        lastPrices: lastPrices
      };

      res.send(response);
  };

//http://localhost:8085/getLatestPrice
  app.get('/getLatestPrice', (req, res) => {
    const latestPrice = (address) => {
  return new Promise((resolve, reject) => {
    var encodedAddress = encodeURIComponent(address);

    request({
      url: `https://api.cointree.com.au/v1/price/btc/${encodedAddress}`,
      json: true
    }, (error, response, body) => {
      if (error) {
        reject('Unable to connect to Cointree API endpoint.');
      } else if (body.spot != '') {
        resolve({
          spotPrice: body.spot,
          bidPrice: body.bid,
          askPrice: body.ask
        });
      }
    });
  });
};

  latestPrice('aud').then((spotPrice) => {
    console.dir(JSON.stringify(spotPrice));

    var lastPrices;
    var collection = db.collection('notes');
    var cursor = collection.find().limit(1).sort({_id:-1});

      cursor.toArray(function(err, results) {
        if (err) throw err;
        console.log('Previous prices: %j', results);
        lastPrices = results[0];
      });

      db.collection('notes').insert(spotPrice, (err, result) => {
        if (err) {
          res.send({ 'error': 'An error has occurred' });
        } else {
          createLatestPriceResponse(spotPrice, lastPrices, res);
        }

      });
    }, (errorMessage) => {
    console.log(errorMessage);
    });
  });
};