
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
function PhotoManager(mapManager) {
	this.mapManager = mapManager;
	this.el = document.querySelector(".photo");
	this.canvas = document.querySelector("#photo");
	this.backBtn = document.querySelector(".photo__thumbnail-back");
	this.sidebar = this.el.querySelector(".photo__sidebar");
	this.sidebarBtn = this.el.querySelector(".photo__sidebar-close");

	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
	this.renderer.setSize(window.innerWidth, window.innerHeight);

	this.scene = new THREE.Scene();

    // ajoute la caméra
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.initSphereMesh();
    this.initParams();

	this.camera.position.z = 5;
   
    // this.scene.add(this.sphereMesh);

	// les écouteurs

	var self = this;
	this.backBtn.addEventListener("click", (function(){
		if( this.mapManager.currentMap ){
			this.mapManager.currentMap.closePhoto();
		}
	}).bind(this))

	this.sidebarBtn.addEventListener("click", function(){
		self.sidebar.classList.toggle("photo__sidebar--display");
		this.classList.toggle("photo__sidebar-close--reverse");
	});
	document.addEventListener("resize", this.onDocumentResize.bind(this), false);
	document.addEventListener("mousedown", this.onDocumentMouseDown.bind(this), false);
	document.addEventListener("mousemove", this.onDocumentMouseMove.bind(this), false);
	document.addEventListener("mouseup", this.onDocumentMouseUp.bind(this), false);


	document.addEventListener("touchstart", this.onDocumentMouseDown.bind(this), false);
	document.addEventListener("touchmove", this.onDocumentMouseMove.bind(this), false);
	document.addEventListener("touchend", this.onDocumentMouseUp.bind(this), false);
}


PhotoManager.prototype = {

	// Set the params of sphere
	initSphereMesh: function(){

		// création d'une sphère goémétrique
	    this.geo = new THREE.SphereGeometry(40, 32, 32);
	    // this.geo.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

	    // création d'une sphère matérielle
	    this.material = new THREE.MeshBasicMaterial({
	    	side: THREE.BackSide
	    });

	 	this.sphereMesh = new THREE.Mesh(this.geo, this.material);
	    this.sphereMesh.name = "photo";


	    this.scene.add(this.sphereMesh);
	},

	// Set control params
	initParams: function() {
		this.savedX = 0;
		this.savedY = 0;
		this.lon = 0;
		this.lat = 0;
		this.savedLongitude = 0;
		this.savedLatitude = 0;
		this.bManualControl = false;
	},


	/* Affichage
	Attend 1000ms que la transition du marker se termine puis : 
	- Met à jour le status
	- Affiche le layout photo
	- Render la scène 
	- Affiche la sidebar
	- Attend 1000ms de plus :
		- dézoome le marker
		- Cache la partie "Map" 
	*/
	display: function() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		setTimeout((function(){
			this.isDisplay = true; 
			this.el.classList.add("photo--display");
			this.backBtn.classList.add("photo__thumbnail-back--display");
			this.render();
			this.sidebar.classList.add("photo__sidebar--display");

			setTimeout((function(){
				this.mapManager.currentMap.currentMarker.unzoom();
				this.mapManager.visiteBody.classList.add("visite__body--hide");
			}).bind(this), 1000)

		}).bind(this), 1000)
	},

	/* 
	- Met à jour le status 
	- Cache la sidebar
	- Cache le layout photo
	 */
	hide: function(){
		this.isDisplay = false;
		this.sidebar.classList.remove("photo__sidebar--display");
		this.sidebarBtn.classList.remove("photo__sidebar-close--reverse");
		this.backBtn.classList.remove("photo__thumbnail-back--display");
		setTimeout((function(){
			this.el.classList.remove("photo--display"); 
			this.mapManager.visiteBody.classList.remove("visite__body--hide");
		}).bind(this), 600)
	},

	onPhotoLoad: function(texture) {
		this.material.map = texture;
		this.el.classList.remove("photo--loading");		
		this.display();
	},

	load: function(marker){
		this.el.classList.add("photo--loading");

		var self = this;
		var loader = new THREE.TextureLoader(); 
		loader.load( marker.target, this.onPhotoLoad.bind(this) );
	},

	render: function(){
		if( this.isDisplay ){
			requestAnimationFrame(this.render.bind(this));// enregistre la fonction pour un appel récurrent 
		}

		if( this.autoRotate && this.lonSpeed == 0 && !this.bManualControl){
			this.lon += 0.05;
		}

	    if( Math.abs(this.lonSpeed ) > 0.5 && !this.bManualControl){
	    	this.lonSpeed *= 0.95
	    } else {
	    	this.lonSpeed = 0;
	    }

	    this.lon += this.lonSpeed;

	    // limitation de la latitude entre -85 et 85 (impossible de voir le ciel ou vos pieds)
	    this.lat = Math.max(-85, Math.min(85, this.lat));

	    // déplace la caméra en fonction de la latitude (mouvement vertical) et de la longitude (mouvement horizontal)
	    var vec = new THREE.Vector3(
	    	500 * Math.sin(THREE.Math.degToRad(90 - this.lat)) * Math.cos(THREE.Math.degToRad(this.lon)),
	    	500 * Math.cos(THREE.Math.degToRad(90 - this.lat)), 
	    	500 * Math.sin(THREE.Math.degToRad(90 - this.lat)) * Math.sin(THREE.Math.degToRad(this.lon))
	    );

	    this.camera.lookAt(vec);

	    // appel la fonction de rendu
	    this.renderer.render(this.scene, this.camera);
	},

	homogeneiseEvent: function(event){
		return event.touches && event.touches.length ? {
			x: event.touches[0].clientX,
			y: event.touches[0].clientY
		} : {
			x: event.clientX,
			y: event.clientY
		};
	},

	onDocumentMouseDown: function(event) {
	    event.preventDefault();
	    var coord = this.homogeneiseEvent(event);


	    this.autoRotate = false;

	    this.bManualControl = true;

	    this.savedX = coord.x;
	    this.savedY = coord.y;

	    this.savedLongitude = this.lon;
	    this.savedLatitude = this.lat;
	},

	onDocumentMouseMove: function(event){
	    // mise à jour si mode manuel
	    var coord = this.homogeneiseEvent(event);
	    if(this.bManualControl)
	    {

	    	this.lonSpeed = ((this.savedX - coord.x) / window.innerWidth) * Math.PI * 2 * 4;
	        this.lon = (this.savedX - coord.x) * 0.1 + this.savedLongitude;
	        this.lat = (coord.y - this.savedY) * 0.1 + this.savedLatitude;
	    }
	},

	onDocumentMouseUp: function(event) {
	    this.bManualControl = false;
	    this.autoRotate = true;
	},

	onDocumentResize: function(){
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}	

}
;
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

	this.width = this.el.offsetWidth;
	this.height = this.el.offsetHeight;

	var markers = this.el.querySelectorAll(".marker");

	for(var i=0; i<markers.length; i++){
		this.markers.push(new Marker(markers[i], this));
	}

	this.initEvents();
}

MapItem.prototype = {

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
		this.el.style = "";
		this.mode = TOP
	},

	toBottom: function() {
		this.el.classList.remove("map--top")
		this.el.classList.remove("map--select")
		this.el.classList.add("map--bottom")
		this.hideMarkers();
		this.el.style = "";
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
				
			this.el.style = "";
			this.mode = SELECT
			this.fade(false);
			this.displayMarkers();
		
			
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

	setPosition(translate) {
		if( translate ) this.translate = translate; 
		this.el.style.transform = `translateX(-50%) translateY(-50%) rotateX(80deg) rotateZ(10deg) translateZ(${this.translate}px)`
	},

	fade(isFade){
		if( isFade ){
			this.el.classList.add("map--fade");
		} else {
			this.el.classList.remove("map--fade");
		}
		
	}
}
;



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
;
// This is where it all goes :)







window.addEventListener("load", function(){
	var managerMap = new MapManager(document.querySelector(".visite"));
})
;
