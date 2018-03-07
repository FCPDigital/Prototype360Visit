<?php

/*
Plugin Name: Visit 360
Plugin URI: https://github.com/FCPDigital/Prototype360Visit
Description: Un plugin de conception d'expérience 360
Version: 0.1
Author: Solal Dussout-Revel
Author URI: http://solaldussout-revel.com
License: GPL2
*/


include_once __DIR__."/models/VisitMap.php";
include_once __DIR__."/models/VisitMarker.php";

class Visit360 {

	public function __construct()
	{
		add_action( 'init', array($this, "generatePostType") );
		$this->registerShortcodes();
		$this->registerFields();
		$this->registerAssets();

	}


	public function generatePostType()
	{

		register_post_type( 'visit360_map', 
			array(
				'labels' => array(
					'name' => __( 'Perspective Map' ),
					'singular_name' => __( 'Perspective Map' )
				),
				'menu_icon'   => 'dashicons-location-alt',
				'supports' => array('title','thumbnail'),
				'public' => true,
				'has_archive' => true,
			)
		);

		register_post_type( 'visit360_marker',
			array(
				'labels' => array(
					'name' => __( 'Perspective Marker' ),
					'singular_name' => __( 'Perspective Marker' )
				),
				'menu_icon'   => 'dashicons-location',
				'supports' => array('title','editor','thumbnail'),
				'public' => true,
				'has_archive' => true
			)
		);
	}


	public function shortcode_visit() {
		$maps = VisitMap::findAll();
		echo include __DIR__."/templates/layout.php";
	}


	public function registerShortcodes(){
		add_shortcode( 
			'visit', array( 
				$this, "shortcode_visit" 
			)
		);
	}

	public function registerAssets()
	{
		add_action('init', 'register_script');
		function register_script() {
			// wp_register_script( 'visit360_scripts', plugins_url('/vendor/three.min.js', __FILE__), array('jquery'), '2.5.1' );
		    wp_register_script( 'visit360_scripts', plugins_url('/assets/visit360.js', __FILE__), array('jquery'), '2.5.1' );


		    wp_register_style( 'visit360_style', plugins_url('/assets/visit360.css', __FILE__), false, '1.0.0', 'all');
		}

		// use the registered jquery and style above
		add_action('wp_enqueue_scripts', 'enqueue_style');

		function enqueue_style(){
		   wp_enqueue_script('visit360_scripts');
		   wp_enqueue_style( 'visit360_style' );
		}
	}

	public function registerFields()
	{

		if(function_exists("register_field_group"))
		{
			register_field_group(array (
				'id' => 'acf_mapmarker',
				'title' => 'MapMarker',
				'fields' => array (
					array (
						'key' => 'field_5a9eb5709a07c',
						'label' => 'top',
						'name' => 'top',
						'type' => 'number',
						'instructions' => 'Correspond à la valeur en pourcentage de la propriété "left" du marker par rapport à son parent. (Compris entre 0 et 100 => 0 étant tout en haut)',
						'required' => 1,
						'default_value' => 0,
						'placeholder' => '',
						'prepend' => '',
						'append' => '',
						'min' => 0,
						'max' => 100,
						'step' => '',
					),
					array (
						'key' => 'field_5a9eb5979a07d',
						'label' => 'left',
						'name' => 'left',
						'type' => 'number',
						'instructions' => 'Correspond à la valeur en pourcentage de la propriété "left" du marker par rapport à son parent. (Compris entre 0 et 100 => 0 étant à gauche)',
						'required' => 1,
						'default_value' => 0,
						'placeholder' => '',
						'prepend' => '',
						'append' => '',
						'min' => 0,
						'max' => 100,
						'step' => '',
					),
					array (
						'key' => 'field_5a9ff286af851',
						'label' => '3D',
						'name' => 'has_3d',
						'type' => 'true_false',
						'message' => '',
						'default_value' => 1,
					),
				),
				'location' => array (
					array (
						array (
							'param' => 'post_type',
							'operator' => '==',
							'value' => 'visit360_marker',
							'order_no' => 0,
							'group_no' => 0,
						),
					),
				),
				'options' => array (
					'position' => 'normal',
					'layout' => 'no_box',
					'hide_on_screen' => array (
					),
				),
				'menu_order' => 0,
			));
			register_field_group(array (
				'id' => 'acf_mapperspective',
				'title' => 'MapPerspective',
				'fields' => array (
					array (
						'key' => 'field_5a9eb4c5daff6',
						'label' => 'markers',
						'name' => 'markers',
						'type' => 'relationship',
						'return_format' => 'object',
						'post_type' => array (
							0 => 'visit360_marker',
						),
						'taxonomy' => array (
							0 => 'all',
						),
						'filters' => array (
							0 => 'search',
						),
						'result_elements' => array (
							0 => 'post_type',
							1 => 'post_title',
						),
						'max' => '',
					),
				),
				'location' => array (
					array (
						array (
							'param' => 'post_type',
							'operator' => '==',
							'value' => 'visit360_map',
							'order_no' => 0,
							'group_no' => 0,
						),
					),
				),
				'options' => array (
					'position' => 'normal',
					'layout' => 'no_box',
					'hide_on_screen' => array (
					),
				),
				'menu_order' => 0,
			));
		}
	}
}

new Visit360();