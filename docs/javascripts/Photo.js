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


	onDocumentMouseDown: function(event) {
	    event.preventDefault();

	    this.autoRotate = false;

	    this.bManualControl = true;

	    this.savedX = event.clientX;
	    this.savedY = event.clientY;

	    this.savedLongitude = this.lon;
	    this.savedLatitude = this.lat;
	},

	onDocumentMouseMove: function(event){
	    // mise à jour si mode manuel


	    if(this.bManualControl)
	    {

	    	this.lonSpeed = ((this.savedX - event.clientX) / window.innerWidth) * Math.PI * 2 * 4;
	        this.lon = (this.savedX - event.clientX) * 0.1 + this.savedLongitude;
	        this.lat = (event.clientY - this.savedY) * 0.1 + this.savedLatitude;
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
