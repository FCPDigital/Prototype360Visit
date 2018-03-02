function NavMap (manager) {
	this.items = manager.el.querySelectorAll(".map__nav-item");

	for(var i=0; i<this.items.length; i++){
		this.initEvent(this.items[i]);
	}

	this.manager = manager; 
}


NavMap.prototype = {

	initEvent: function(item){
		var self = this;
		item.addEventListener("click", function(){
			var rank = self.manager.getMapRankFromId(this.getAttribute("data-map"));
			console.log(rank);
			if(rank >= 0){
				self.manager.select(rank);
			}
		})
	},
	
	selectFromMap: function(map){
		this.unSelectAll();
		for(var i=0; i<this.items.length; i++){
			if( this.items[i].getAttribute("data-map") == map.id ){
				this.items[i].classList.add("map__nav-item--active");
			} else {
				this.items[i].classList.add("map__nav-item--disable");
			}
		} 
	},

	unSelectAll: function(){
		for(var i=0; i<this.items.length; i++){
			this.items[i].classList.remove("map__nav-item--active");
			this.items[i].classList.remove("map__nav-item--disable");
		} 
	}
}
;
