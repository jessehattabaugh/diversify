import fetch from 'node-fetch';

const balance = '35619.20';

const coins = {
	aave: {},
	algo: {},
	atom: {},
	bal: {},
	band: {},
	bat: {},
	bnt: {},
	btc: {},
	comp: {},
	cvc: {},
	dai: {},
	dash: {},
	dnt: {},
	eos: {},
	eth: {},
	fil: {},
	grt: {},
	knc: {},
	link: {},
	lrc: {},
	ltc: {},
	mana: {},
	mkr: {},
	nmr: {},
	nu: {},
	omg: {},
	ren: {},
	rep: {},
	snx: {},
	uma: {},
	wbtc: {},
	xlm: {},
	xtz: {},
	yfi: {},
	zec: {},
	zrx: {},
	// these don't have market cap data for some strange reason
	//'celo': {},
	//'oxt': {},
	//'uni': {},
};

import { list } from './list.js';
// console.log(list);
const wantedSymbols = Object.keys(coins);
const equalPercentage = 1 / wantedSymbols.length;
//console.log(equalPercentage);

//console.log(symbols);
for (const coin of list) {
	//console.log(coin.symbol);
	if (wantedSymbols.includes(coin.symbol)) {
		//console.log(coin);
		coins[coin.symbol].id = coin.id;
	}
}

let totalCap = 0;
let totalPcp30d = 0;
let totalPcp24h = 0;
for (const symbol of wantedSymbols) {
	const response = await fetch(
		`https://api.coingecko.com/api/v3/coins/${coins[symbol].id}`,
	);
	const data = await response.json();
	const marketCap = data.market_data.market_cap.usd;
	console.log(`${symbol} market cap is ${marketCap}`);
	totalCap += marketCap;
	coins[symbol].mc = marketCap;

	const pcp30d = data.market_data.price_change_percentage_30d;
	console.log(`${symbol} pcp30d is ${pcp30d}`);
	totalPcp30d += pcp30d;
	coins[symbol].pcp30d = pcp30d;

	const pcp24h = data.market_data.price_change_percentage_24h;
	console.log(`${symbol} pcp24h is ${pcp24h}`);
	totalPcp24h += pcp24h;
	coins[symbol].pcp24h = pcp24h;

}

for (const symbol of wantedSymbols) {
	// calculate percentage of total market cap
	coins[symbol].mcp = coins[symbol].mc / totalCap;
	// calculate percentage of total pcp30d
	coins[symbol].pcp30dp = coins[symbol].pcp30d / totalPcp30d;
	// calculate percentage of total pcp24h
	coins[symbol].pcp24hp = coins[symbol].pcp24h / totalPcp24h;
	// calculate percentage of balance
	coins[symbol].per =
		(coins[symbol].mcp * 0.16) +
		(equalPercentage * 0.50) +
		(coins[symbol].pcp30dp * 0.16) +
		(-coins[symbol].pcp24hp * 0.16);
	// calculate position in us dollars
	coins[symbol].usd = Math.floor(balance * coins[symbol].per * 100) / 100;
}

//console.log(coins);

let total = 0;
for (const symbol of wantedSymbols) {
	console.log(`${symbol}: $${coins[symbol].usd}`);
	total += coins[symbol].usd;
}
console.log('total: ', total);
