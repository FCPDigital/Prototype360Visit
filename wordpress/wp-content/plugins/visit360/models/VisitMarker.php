<?php 


class VisitMarker {

	public $post = null;
	public $img = null;
	public $has_3d = true; 
	public $x = null;
	public $y = null;

	public function __construct($arg)
	{
		if(is_numeric($arg)) {
			$post = get_post($arg); 
		}

		if($arg instanceof WP_Post){
			$post = $arg;
		}

		$this->post = $post;
		$this->img = get_the_post_thumbnail_url($this->post);

		if(!get_field("has_3d", $this->post)){
			$this->has_3d = false;
		}
		if(get_field("left", $this->post)){
			$this->x = get_field("left", $this->post) / 100;
		}
		if(get_field("top", $this->post)){
			$this->y = get_field("top", $this->post) / 100;
		}
	}

	public function __toString()
	{
		return json_encode([ 
			"x" => $this->x,
			"y" => $this->y,
			"url" => $this->img,
			"has_3d" => $this->has_3d 
		], JSON_UNESCAPED_SLASHES);
	}

}