export default class Coin {
  constructor() {
    this.tickerData = null;
  }

  getExchangeRates() {
    return new Promise((res, rej) => {
      fetch(
        'https://api.coinmarketcap.com/v1/ticker/?convert=TWD&limit=5'
      )
        .then(res => res.json())
        .then(json => {
          this.tickerData = this.parseTickerData(json);
          res(this.tickerData);
        })
        .catch(res => {
          console.log(`error, ${res}`);
        });
    });
  }

  parseTickerData(data_json_array) {
    const tickerList = [];
    data_json_array.forEach(elemObj => {
      const temp = {};
    [`id`,`name`,`market_cap_usd`,`24h_volume_usd`].forEach(key=>{
      temp[key]=elemObj[key];
    });
    tickerList.push(temp);



      // let oneCoinObj = (dataObj[elemObj.id] = {});
      // oneCoinObj.name = elemObj.name;
      // oneCoinObj.price_usd = elemObj.price_usd;
      // oneCoinObj.price_twd = elemObj.price_twd;
    });
    return tickerList;
  }

  /**
   *
   * @param fromKey bitcoin, ethereum...
   * @param toKey usd, twd
   */
  getRate(fromKey, toKey) {
    return this.tickerData[fromKey][`price_${toKey}`];
  }
}
