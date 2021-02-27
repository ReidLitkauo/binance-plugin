//##############################################################################
// /bysl-toggle.js
// That little red-green panel that only shows one of the buy/sell input
// groups at a time.

//##############################################################################
// UI Setup
function load_bysltoggleUI () {

	// If it already exists then exit
	if ($(q_bysltoggle).length) return;

	// I really wish they just had a rule somewhere that said:
	// div { position: relative; }
	// It's super annoying to attach a position=absolute and see it try to use
	// the window as its parent.
	$(q_byslparent).css('position', 'relative');

	// Append the toggley boi
	// Nothing inside it for now ... what to add in?
	$(q_byslparent).append($(`
		<div id='${id_bysltoggle}' class='${cl_by}'>
		</div>
	`));

	// Switch from buy to sell when clicked
	$(q_bysltoggle).click((e) => {
		$(q_bysltoggle).toggleClass(`${cl_by} ${cl_sl}`);
	});

}

//##############################################################################
// Load this module
setTimeout(() => {

	// Load the UI
	load_bysltoggleUI();

	// Reload the UI after a small delay when switching from "Spot" to "Margin"
	// When switching these tabs, all elements I injected into the DOM disappear
	// It's some weird React bullshit, I don't claim to understand
	$(q_byslmargintabs).click((e) => { setTimeout(load_bysltoggleUI, x_update); });

}, x_delay);

