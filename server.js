const Alpaca = require("@alpacahq/alpaca-trade-api");
const alpaca = new Alpaca();

const WebSocket = require("ws");
const wss = new WebSocket("wss://stream.data.alpaca.markets/v1beta1/news");

wss.on("open", function () {
  console.log("Connected!");

  //Login
  const auth = {
    action: "auth",
    key: process.env.APCA_API_KEY_ID,
    secret: process.env.APCA_API_SECRET_KEY,
  };
  wss.send(JSON.stringify(auth));

  //Subscription
  const sub = {
    action: "subscribe",
    news: ["*"],
  };
  wss.send(JSON.stringify(sub));
});

wss.on("message", async function (msg) {
  let impact = 0;

  console.log("Message is " + msg);

  const event = JSON.parse(msg)[0];

  if (event.T == "n") {
    const apiReq = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Only respond with a number from 1-100. Your role is to analyze real-time news data and provide me with a sentiment rating on a scale of 1 to 100. A rating of 1 should indicate to sell the stock, while a rating of 100 should be to buy the stock. Your primary function is to assist me in making well-informed trading decisions by analyzing the sentiment of the news surrounding the targeted companies",
        },
        {
          role: "user",
          content:
            "Given the headline '" +
            event.headline +
            "', show me a number from 1-100 detailing the impact of the headline. If you cannot, then write 0. ALWAYS return just a number.",
        },
      ],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.OPENAI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiReq),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        //AI response
        console.log(data.choices[0].message);
        impact = parseInt(data.choices[0].message.content);
      });

    const tradeSymbol = event.symbols[0];
    // const tradeSymbol = "BIOL";

    if (impact >= 65) {
      let order = await alpaca.createOrder({
        symbol: tradeSymbol,
        qty: 1,
        side: "buy",
        type: "market",
        time_in_force: "day",
      });
    } else if (impact <= 45 && impact != 0) {
      let positions = await alpaca.getPositions();
      positions.map((position) => {
        if (position.symbol === tradeSymbol) {
          let closed = alpaca.closePosition(tradeSymbol);
        }
      });
    }
  }
});
