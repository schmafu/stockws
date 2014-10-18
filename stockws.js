var http = require('http');
var url = require('url');
var querystring = require('querystring');

var server = http.createServer(function (req, res) {
if (url.parse(req.url, true).pathname == '/stockquote') {
     req.on('data', function(chunk) {
      //  console.log("chunk: " + chunk);
      //  console.log("text: " + JSON.stringify(querystring.parse(chunk.toString())));
        var slack = querystring.parse(chunk.toString());
        //var symbol = querystring.parse(chunk).text.substr(1);
      //  console.log(slack.text.toString());

        var symbol = slack.text.substr(1);


        var queryurl = 'http://query.yahooapis.com/v1/public/yql?q=';
        var data = encodeURIComponent("select * from yahoo.finance.quotes where symbol in ('" + symbol + "')");

        http.get(queryurl + data + "&format=json&diagnostics=true&env=http://datatables.org/alltables.env", function (stockres) {
          // console.log("response: " + stockres.statusCode);

          stockres.on('data', function(result) {
            try {
              var jsonresult = JSON.parse(result);
              // console.log("Kurs von " + jsonresult.query.results.quote.Name + " " + jsonresult.query.results.quote.Currency + " "  + jsonresult.query.results.quote.LastTradePriceOnly);
	            res.writeHead(200, { 'Content-Type': 'application/json' });

              res.end(JSON.stringify({ "text": "" + jsonresult.query.results.quote.Name + " " + jsonresult.query.results.quote.Currency + " *" + jsonresult.query.results.quote.LastTradePriceOnly + "* (" + jsonresult.query.results.quote.PercentChange + ") - 52 week range *" + jsonresult.query.results.quote.YearRange +"*"}));
            } catch (e) {} // falls ein blödsinn beim JSON.parse rauskommt, machen wir einfach gar nix ;)

          });

        }).on('error', function(e) {
            console.log("error: " + e.message);
        });

    });
 }
}).listen(4711);
