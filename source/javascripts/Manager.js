


function MapManager(el) {
	this.el = el; 
	this.maps = [];
	this.photoManager = new PhotoManager(this);
	this.visiteBody = this.el.querySelector(".visite__body");
	this.closeMapButton = this.el.querySelector("#close-map-button");
	this.nav = new NavMap(this);

	var maps = this.el.querySelectorAll(".map"); 

	for(var i=0; i<maps.length; i++){
		this.maps.push(new MapItem(maps[i], this));
	}

	this.initEvents();
	this.regular();
} 



MapManager.prototype = {

	config: {
		step: 100,
		offset: 50
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
	},

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
			this.maps[i].setPosition(-1*i * this.config.step - h/2 + this.config.offset);
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
			this.maps[i].setPosition(-1*i * this.config.step - h/2 + this.config.offset + decal);
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
	}
}
