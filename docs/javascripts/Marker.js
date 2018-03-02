
function Marker(el, map) {
	this.el = el;
	this.map = map;
	this.extractInfo();
}

Marker.prototype = {

	get style(){
		return `top: ${this.position.y*this.map.width}px; left: ${this.position.x*this.map.height}px;`
	},

	extractInfo: function(){
		var arg = this.el.getAttribute("data-marker");
		if( arg ){
			this.data = JSON.parse(arg);
		} else {
			this.data = {};
		}
		this.position = {
			x: this.data.x, 
			y: this.data.y
		}
		this.target = "images/360/"+this.data.url;
	},

	updateStyle: function(){
		this.el.setAttribute("style", this.style);
	},

	display: function(){
		this.updateStyle();
		this.el.classList.add("marker--display");
	},
	
	hide: function(){
		this.el.classList.remove("marker--display");
	},

	zoom: function(){
		this.el.classList.add("marker--zoom");
	},

	unzoom: function(){
		this.el.classList.remove("marker--zoom");
	}

}
;
