// This is where it all goes :)
//= require "Marker"
//= require "Photo"
//= require "Nav"
//= require "Map"
//= require "Manager"


window.addEventListener("load", function(){
	var managerMap = new MapManager(document.querySelector(".visite"));
})
