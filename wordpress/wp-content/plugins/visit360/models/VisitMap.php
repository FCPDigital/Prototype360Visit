<?php 


class VisitMap {

	public $markers = []; 
	public $post = null; 
	public $img = null;
	public $title = "";
	public $id; 


	public function __construct($arg)
	{
		if(is_numeric($arg)) {
			$post = get_post($arg); 
		}

		if($arg instanceof WP_Post){
			$post = $arg;
		}

		$this->post = $post;
		$this->id = "map-".$this->post->ID;
		$this->title = get_the_title($this->post);
		$this->img = get_the_post_thumbnail_url($this->post);
		$this->markers = VisitMap::findMarkersFromMap($this);

	}

	public static function findAll(){
		$maps = get_posts(array(
			'post_type' => 'visit360_map'
		));
		$result = [];
		foreach($maps as $key => $map) 
		{
			array_push($result, new VisitMap($map));
		}
		return $result; 
	}

	public static function findMarkersFromMap(VisitMap $map)
	{

		$markers = get_field("markers", $map->getPost());
		
		$result = [];
		foreach($markers as $key => $marker) 
		{
			array_push($result, new VisitMarker($marker));
		}
		return $result; 
	}

	public function getPost(){
		return $this->post;
	}

	public function getMarkers()
	{
		return $this->markers;
	}

	public function addMarker(VisitMarker $marker) 
	{
		array_push($this->markers, $marker);
	}
}