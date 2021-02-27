//##############################################################################
// /globals.js
// Keep all the global constants nice and tidy here.

// TODO put this in a good spot
// There's a tiny scrollbar that spans the entire height of the page
// Disable that
// It annoys me
$('#__APP').css('overflow', 'hidden');

//##############################################################################
// My Shit

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// Application State

let x_state = {

	// Which of the "price" or "profit" inputs was last focused/edited
	// True means user entered price and we should update profit
	priceprofit: true

};

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// Timings

// Delay for loading in the plugin
const x_delay = 5000;

// Delay for updating internal state
const x_update = 250;

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// Various IDs for my elements

// For the tab and the associated panel
const id_mytab    = 'tab-crex';    const q_mytab    = '#' + id_mytab;
const id_mypanel  = 'panel-crex';  const q_mypanel  = '#' + id_mypanel;

// For the inputs shown on the top-right
const id_priceinput  = 'x-priceinput';   const q_priceinput  = '#' + id_priceinput;
const id_profitinput = 'x-profitinput';  const q_profitinput = '#' + id_profitinput;
const id_commission  = 'x-commission';   const q_commission  = '#' + id_commission;
const id_marginx     = 'x-marginx';      const q_marginx     = '#' + id_marginx;
const id_poslife     = 'x-poslife';      const q_poslife     = '#' + id_poslife;
const id_interest    = 'x-interest';     const q_interest    = '#' + id_interest;

// For the buy/sell slidey panel
const id_bysltoggle = 'x-bysltoggle';  const q_bysltoggle = '#' + id_bysltoggle;

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// Internal classes used to reflect UI states and changes

const cl_by = 'x-by';
const cl_sl = 'x-sl';

//##############################################################################
// Binance's Shit

// Plucked from a scrape of Binance's UI, subject to change

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// Internal classes used to reflect UI states and changes

const cl_tabdefault      = 'draggableCancel css-ov54vn';
const cl_tabinnerdefault = 'draggableCancel css-6ey3a2';
const cl_tabactive       = 'active';

const cl_paneldefault = 'css-1jvocpw';
const cl_panelhide    = 'css-1jvocpw';
const cl_panelshow    = 'css-im6ko3';

const cl_byslmodeactive     = 'css-f9qfej';
const cl_byslmarginactive   = 'css-14bxnpi';
const cl_byslmargininactive = 'css-jtc852';

const cl_orderhodler = 'orderlist-container';
const cl_orderbook   = 'orderbook-list';
const cl_order       = 'orderbook-progress';
const cl_askorderamt = 'ask-light';
const cl_bidorderamt = 'bid-light';

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// Locations for various UI container elements

// Panel/tabs on bottom-left
// The panel parent is also the parent container for the tab bar.
// The first child is the tab bar, every subsequent child is a panel.
const q_panelparent  = '#__APP >div >div >div:nth-child(6) >div >div';
const q_tabparent    = q_panelparent + ' >div:nth-child(1)';
const q_allpanels    = q_panelparent + ' >div:not(:nth-child(1))';
const q_alltabs      = q_panelparent + ' div[id^="tab-"]';
const q_alltabinners = q_alltabs + ' >div';

// Big buy/sell container on bottom-right
const q_byslwrap   = '#__APP >div >div >div:nth-child(5) >div';
const q_byslparent = q_byslwrap + ' >div:nth-child(3)';
const q_byslactive = q_byslwrap + ` >div:nth-child(2) .${cl_byslmodeactive}`;
const q_byslmargintabs     = q_byslwrap + ' >div:nth-child(1) >div:nth-child(1) >div:nth-child(1) >div';
const q_byslmargin         = q_byslmargintabs + ` .${cl_byslmarginactive}`;
const q_byslmargininactive = q_byslmargintabs + ` .${cl_byslmargininactive}`;

// Order book
const q_orderloaskamt = `.${cl_orderhodler} .${cl_orderbook}:first-child .${cl_order}:last-child .${cl_askorderamt}`;
const q_orderhibidamt = `.${cl_orderhodler} .${cl_orderbook}:last-child .${cl_order}:first-child .${cl_bidorderamt}`;

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// IDs for buy/sell input fields

const q_input_marginbyprice     = '#FormRow-BUY-price';
const q_input_marginbystopprice = '#FormRow-BUY-stopLimitPrice';
const q_input_marginbyamount    = '#FormRow-BUY-quantity';
const q_input_marginbytotal     = '#FormRow-BUY-total';
const q_input_marginslprice     = '#FormRow-SELL-price';
const q_input_marginslstopprice = '#FormRow-SELL-stopLimitPrice';
const q_input_marginslamount    = '#FormRow-SELL-quantity';
const q_input_marginsltotal     = '#FormRow-SELL-total';

//##############################################################################
// Helper Functions

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
// Margin Trading Profit/Price Conversion

// Given an expected profit (as multiple of collateral),
// find the price that would allow for this profit if realized.
function find_price (profit) {

	// #   #   #   #   #   #   #   #   #   #   #   #   #   #   #   #   #   #   #
	// Set up variables for the big formula

	// Are we buying or selling?
	let bysl = x_state.bysl;

	// What's the entry price?
	// If we're selling, then simply invert the market.
	// Selling on an ETH/BTC market is the same as buying on a BTC/ETH market.
	// This is also why the entire formula is inverted down below if selling.
	let entry_price = x_state.entry_price ** (bysl ? 1 : -1);

	// Rest is self-explanatory
	let interest    = x_state.interest;
	let loan_length = x_state.loan_length;
	let leverage    = x_state.leverage;
	let commission  = x_state.commission;

	// #   #   #   #   #   #   #   #   #   #   #   #   #   #   #   #   #   #   #
	// Run the formula

	// See my notes on Discord for how this formula looks on paper
	return (
		( entry_price * ( ((interest + 1) ** loan_length) * (leverage - 1) + profit ) )
		/ ( leverage * ((1 - commission) ** 2))
	) ** (bysl ? 1 : -1);
}

// Exactly the same as above, except inverse
function find_profit (price) {

	let bysl        = x_state.bysl;
	let interest    = x_state.interest;
	let loan_length = x_state.loan_length;
	let leverage    = x_state.leverage;
	let commission  = x_state.commission;

	price = price ** (bysl ? 1 : -1);
	let entry_price = x_state.entry_price ** (bysl ? 1 : -1);

	return (
		( (price * leverage * ((1 - commission) ** 2)) / entry_price )
		- ( ((interest + 1) ** loan_length) * (leverage - 1) )
	);

}
