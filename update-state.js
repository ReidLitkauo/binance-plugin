//##############################################################################
// /update-state.js
// Gather all relevant information about the state of the UI into one spot.
// Copyright (C) 2021 Reid Litkauo
// License: GNU GPL v3

setTimeout(() => { setInterval(() => {

	// True if we are buying, false if we are selling
	x_state.bysl = $(q_bysltoggle).hasClass(cl_by);

	// Order type, one of: "Limit" "Market" "Stop-limit" "OCO"
	x_state.order_type = $(q_byslactive).text();

	// This is just a fancy switch statement.
	// Select the entry price from the appropriate field
	x_state.entry_price = {
		true: {
			'Limit':      $(q_input_marginbyprice).val(),
			'Market':     parseFloat( $(q_orderloaskamt).html() ),
			'Stop-limit': $(q_input_marginbystopprice).val(),
			'OCO':        $(q_input_marginbyprice).val(),
		},
		false: {
			'Limit':      $(q_input_marginslprice).val(),
			'Market':     parseFloat( $(q_orderhibidamt).html() ),
			'Stop-limit': $(q_input_marginslstopprice).val(),
			'OCO':        $(q_input_marginslprice).val(),
		},
	}[x_state.bysl][x_state.order_type];

	// Special stop loss price for OCO orders
	x_state.stoploss_price = {
		true: {
			'Limit': null, 'Market': null, 'Stop-limit': null,
			'OCO': $(q_input_marginbystopprice).val(),
		},
		false: {
			'Limit': null, 'Market': null, 'Stop-limit': null,
			'OCO': $(q_input_marginslstopprice).val(),
		},
	}[x_state.bysl][x_state.order_type];

	// Grab leverage from currently-active trade type tab
	let tmp_leverage = $(q_byslmargin)[0].innerText.match(/[0-9]+/);
	x_state.leverage = tmp_leverage ? parseInt(tmp_leverage[0]) : 1;

	// Self-explanatory
	x_state.interest    = parseFloat($(q_interest).val()) / 100.0;
	x_state.loan_length = parseInt($(q_poslife).val());
	x_state.commission  = parseFloat($(q_commission).val()) / 100.0;

// Run on an interval, starting with a delay
}, x_update); }, x_delay - x_update);
