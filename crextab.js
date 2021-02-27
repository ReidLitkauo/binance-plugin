//##############################################################################
// /crextab.js
// Code for my tab on the bottom-left
// Copyright (C) 2021 Reid Litkauo
// License: GNU GPL v3

//##############################################################################
// UI Setup
function load_crextabUI () {

	// If the tab already exists then exit
	if ($(q_mytab).length) return;

	// Add my tab to the tab list
	$(q_tabparent).append($(`
		<div id='${id_mytab}' class='${cl_tabdefault}'>
			<div class='${cl_tabinnerdefault}'>Margin Calculator</div>
		</div>
	`));

	// Insert my panel
	$(q_panelparent).append($(`
		<div id='${id_mypanel}' class='${cl_paneldefault}'>

			<span>
				<span>
					<label>
						Price
						<input id='${id_priceinput}' type='number' step='any'>
					</label>
					=
					<label>
						<input id='${id_profitinput}' type='number' step='any'>
						% Profit
					</label>
				</span>
				<label>
					Commission:
					<input id='${id_commission}' type='number' value='0.1' step='any'>
					%
				</label>
				<label>
					Lifespan:
					<input id='${id_poslife}' type='number' min='1' value='24' step='1'>
					hr
				</label>
				<label>
					Interest:
					<input id='${id_interest}' type='number' min='0' step='any'>
					%/hr
				</label>
			</span>

			<div>
				<div>Buy/Sell: <span id='show_bysl'></span></div>
				<div>Order Type: <span id='show_ordertype'></span></div>
				<div>Entry Price: <span id='show_entryprice'></span></div>
				<div>Stoploss Price: <span id='show_stoplossprice'></span></div><br>
				<div>Commission: <span id='show_commission'></span></div>
				<div>Leverage: <span id='show_leverage'></span></div>
				<div>Loan Length: <span id='show_loanlength'></span></div>
				<div>Interest: <span id='show_interest'></span></div>
			</div>

		</div>
	`));

	// Logic to handle tab clicks
	$(q_alltabs).click((e) => {
	
		// Find parent tab element (it will have a child, the inner one won't)
		el_tabouter = ($(e.target).children().length > 0) ? $(e.target) : $(e.target).parent();
		el_tabinner = $(el_tabouter.children()[0]);
	
		// Remove "active" class from all tabs
		$(q_alltabinners).removeClass(cl_tabactive);
	
		// ... and add it back to the selected tab
		el_tabinner.addClass(cl_tabactive);

		// Hide all panels
		$(q_allpanels).removeClass(cl_panelshow).addClass(cl_panelhide);
	
		// Display my panel if my tab was clicked
		if (el_tabouter.attr('id').includes(id_mytab))
			$(q_mypanel).removeClass(cl_panelhide).addClass(cl_panelshow);
		
	});

	// Logic to handle changes to price/profit input values
	$(q_priceinput).on('focus input', (e) => {
		x_state.priceprofit = true;
	});
	$(q_profitinput).on('focus input', (e) => {
		x_state.priceprofit = false;
	});

}

//##############################################################################
// Load this module
setTimeout(() => {

	// Initial UI setup
	load_crextabUI();

	// See /bysl-toggle.js for explanation
	$(q_byslmargintabs).click((e) => { setTimeout(load_crextabUI, x_update); });
	
	// Set a recurring function call to update the UI
	setInterval(() => {

		// Update debug fields
		$('#show_bysl').html(x_state.bysl ? 'T' : 'F');
		$('#show_ordertype').html(x_state.order_type);
		$('#show_entryprice').html(x_state.entry_price);
		$('#show_stoplossprice').html(x_state.stoploss_price);
		$('#show_commission').html(x_state.commission);
		$('#show_leverage').html(x_state.leverage);
		$('#show_loanlength').html(x_state.loan_length);
		$('#show_interest').html(x_state.interest);

		// Update the price/profit fields
		if (x_state.priceprofit)
			$(q_profitinput).val( find_profit(parseFloat($(q_priceinput).val())) * 100.0 );
		else
			$(q_priceinput).val( find_price(parseFloat($(q_profitinput).val()) / 100.0) );

	}, x_update);

}, x_delay);
