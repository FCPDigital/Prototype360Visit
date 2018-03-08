


function MapManager(el) {
	this.el = el; 
	this.maps = [];
	this.photoManager = new PhotoManager(this);
	this.container = this.el.querySelector(".visite__archive");
	this.closeMapButton = this.el.querySelector("#close-map-button");
	this.nav = new NavMap(this);
	this.isResponsive = false; 

	this.init();
} 



MapManager.prototype = {

	config: {
		step: 150,
		navWidth: 150,
		offset: 10,
		width: 500,
		height: 500
	},

	getMapRankFromId: function(id){
		for(var i=0; i<this.maps.length; i++){
			if(this.maps[i].id == id) {
				return i; 
			}
		}
		return null;
	},

	regular: function(){
		
		var n = this.maps.length;
		var h = n - 1 * this.config.step; 

		for(var i = 0; i < this.maps.length; i++){
			this.maps[i].setPosition(-1*i * this.config.step - h/2 + this.offset);
			this.maps[i].fade(false);
		}
		this.currentMap = null;
		this.mode = "regular";
		this.closeMapButton.classList.remove("map__close--display");

		this.nav.unSelectAll();
	},

	focus: function(rank){
		
		var n = this.maps.length;
		var h = n - 1 * this.config.step; 

		for(var i = 0; i < this.maps.length; i++){
			var decal = 0;
			if( i < rank) {
				decal = 20; 
			} else if( i > rank) {
				decal = -20;
			}

			if( rank == i ){
				this.maps[i].fade(false);
			} else {
				this.maps[i].fade(true);
			}
			this.maps[i].setPosition(-1*i * this.config.step - h/2 + this.offset + decal);
		}
		this.mode = "focus";
	},

	select: function(rank) {

		for(var i=0; i<this.maps.length; i++){
			if( i < rank ){
				this.maps[i].toTop();
			} else if( i > rank ) {
				this.maps[i].toBottom();
			} else {
				this.maps[i].select();
				this.currentMap = this.maps[i];
				this.mode = "map";
			}
		}

		this.nav.selectFromMap(this.currentMap);
		this.closeMapButton.classList.add("map__close--display");
	},

	get height(){
		var offset = 0;
		if( this.isResponsive ){
			offset = 100;
		}
		return this.maps.length * this.config.height * 0.2 + (this.maps.length - 1) * this.config.step + offset; 
	},

	get offset(){
		return this.isResponsive ? this.config.offset + 50 : this.config.offset;
	},


	////////////////////////////////
	//
	//		Responsive
	//
	////////////////////////////////

	responsive: function(){
		this.isResponsive = true; 
		this.nav.responsive();
	},

	desktop: function(){
		this.isResponsive = false; 
		this.nav.desktop();
	},

	updateBoundaries: function(){
		var w = this.el.offsetWidth; 
		if( w < this.config.width + this.config.navWidth ) {
			this.responsive();
		} else {
			this.desktop();
		}

		switch (this.mode){
			case "regular": this.regular(); break;
			case "focus": this.focus(); break;
			case "map": setTimeout(this.currentMap.refreshMarkerPositions.bind(this.currentMap), 1000); break;
		}


		this.container.style.height = this.height + "px";
	},


	////////////////////////////////
	//
	//		Initialisation
	//
	////////////////////////////////


	initEvent: function(map, rank){
		var self = this; 

		map.el.addEventListener("mouseenter", function(){
			if( self.mode != "map"){
				self.focus(rank);	
			}
		})

		map.el.addEventListener("mouseleave", function(){
			if( self.mode != "map") {
				self.regular();	
			}
		})

		map.el.addEventListener("click", function(){
			self.select(rank);
		})
	},

	initEvents: function(){
		var self = this;
		for(var i=0; i<this.maps.length; i++){
			this.initEvent(this.maps[i], i);
		}

		this.closeMapButton.addEventListener("click", function(){
			self.regular();
			for(var i=0; i<self.maps.length; i++){
				self.maps[i].toRegular();
			}
		})

		window.addEventListener("resize", self.updateBoundaries.bind(this));
	},


	init: function(){
		var maps = this.el.querySelectorAll(".map"); 	
		for(var i=0; i<maps.length; i++){
			this.maps.push(new MapItem(maps[i], this));
		}

		this.updateBoundaries();
	
		this.initEvents();
		this.regular();
	}
}
