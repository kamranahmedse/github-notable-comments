import {Notable} from "./notable";

const notable = new Notable();
notable.init();

// Ughhh! Have to do this because the script
// is not reloaded on the change of page
window.setInterval(notable.refresh, 300);
