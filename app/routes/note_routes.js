// routes/note_routes.js
//could also use request-promise library here instead of request

var request = require('request');
//index.js picks up this module.exports
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
/* Monero promis switch, will need changing to request promise?! Try in future..

*/
// calling our promise
  latestPrice('aud').then((spotPrice) => {
    console.dir(JSON.stringify(spotPrice));

//https://docs.mongodb.com/manual/reference/method/db.collection.find/
    var lastPrices;
    var collection = db.collection('notes');
    var cursor = collection.find().limit(1).sort({_id:-1});

    //mongo method cursor.toArray.. https://docs.mongodb.com/manual/reference/method/cursor.toArray/
    //%j https://stackoverflow.com/questions/26266232/j-specifier-in-console-log-excludes-some-properties
    // this part creates the lastPrices variable and pushes to consoe or u..
      cursor.toArray(function(err, results) {
        if (err) throw err;
        console.log('Previous prices: %j', results);
        lastPrices = results[0];
      });
      //db defined as mlab addy. Inserting spotPrice promise response from above!
      // this part inserts latest spotPrice into the db
      // createLatestPriceResponse unites spotPrice and our newly created
      // lastPrices variable made by cursor.toArray
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