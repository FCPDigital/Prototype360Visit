
const SELECT= 1
const TOP= 4
const BOTTOM= 5
const REGULAR= 2

function MapItem(el, manager) {
	this.el = el;
	this.id = this.el.getAttribute("id");
	this.manager = manager;
	this.markers = [];
	this.mode = REGULAR
	this.imageUrl = this.el.getAttribute("data-url");

	this._width = this.el.offsetWidth;
	this._height = this.el.offsetHeight;

	var markers = this.el.querySelectorAll(".marker");

	for(var i=0; i<markers.length; i++){
		this.markers.push(new Marker(markers[i], this));
	}

	this.initEvents();
}

MapItem.prototype = {

	get width(){
		return this._width;
		// return this.manager.isResponsive ? window.innerWidth : this._width;
	},

	get height(){
		return this._height;
		// return this.manager.isResponsive ? window.innerHeight : this._height;
	},

	initEvents: function(){
		for(var i=0; i<this.markers.length; i++){
			this.initEvent(this.markers[i]);
		}
	},

	initEvent: function(marker){
		var self = this;
		marker.el.addEventListener("click",function(){
			self.openPhoto(marker);
		}, false)
	},

	openPhoto: function(marker){
		marker.zoom();
		this.currentMarker = marker;
		this.manager.photoManager.load(marker);
	},

	closePhoto: function(){
		if( this.currentMarker ){
			this.currentMarker.unzoom();
			this.manager.photoManager.hide();
			this.currentMarker = null;
		}
	},

	toTop: function() {
		this.el.classList.remove("map--bottom")
		this.el.classList.remove("map--select")
		this.el.classList.add("map--top")
		this.hideMarkers();
		this.cleanPosition();
		this.mode = TOP
	},

	toBottom: function() {
		this.el.classList.remove("map--top")
		this.el.classList.remove("map--select")
		this.el.classList.add("map--bottom")
		this.hideMarkers();
		this.cleanPosition();
		this.mode = BOTTOM
	},

	toRegular: function(){
		this.setPosition();
		if( this.mode == SELECT ){
			this.hideMarkers();
		}

		this.el.classList.remove("map--top")
		this.el.classList.remove("map--bottom")
		this.el.classList.remove("map--select")
		this.mode = REGULAR
	},

	select: function(){
		if( this.mode != SELECT ){
			
			// this.el.classList.remove("map--top");
			// this.el.classList.remove("map--bottom");
			// this.el.classList.add("map--select");

			this.el.className = "map map--select"
				
			this.cleanPosition();
			this.mode = SELECT
			this.fade(false);
			this.displayMarkers();
		
			
		}
	},

	refreshBoundaries: function(){
		this._width = this.el.offsetWidth;
		this._height = this.el.offsetHeight;
		console.log(this._width);
	},

	refreshMarkerPositions: function(){
		this.refreshBoundaries();
		for(var i=0; i<this.markers.length; i++){
			this.markers[i].updateStyle();
		}
	},

	hideMarkers: function() {
		for(var i=0; i<this.markers.length; i++){
			this.markers[i].hide();
		}
	},

	displayMarkers: function(){
		var self = this;
		for(var i=0; i<this.markers.length; i++){
			(function(rank){

				setTimeout(function(){
				
					self.markers[rank].display();
				
				}, rank*100 + 500)
			
			})(i);
		}
	},

	cleanPosition: function(){
		this.el.style = `background-image: url("${this.imageUrl}");`;
	},

	setPosition: function(translate) {
		if( translate ) this.translate = translate; 
		this.el.style = `transform: translateX(-50%) translateY(-50%) rotateX(75deg) rotateZ(10deg) scale(0.9) translateZ(${this.translate}px); background-image: url("${this.imageUrl}");`
	},

	fade: function(isFade){
		if( isFade ){
			this.el.classList.add("map--fade");
		} else {
			this.el.classList.remove("map--fade");
		}
		
	}
}
