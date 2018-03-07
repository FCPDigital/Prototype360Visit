
<div class="visite">
  <!-- Maps -->

  <div class="visite__body">
    
    <div class="visite__util ">
      <button id="close-map-button" class="map__close"><i class="material-icons">close</i></button>
      
      <div class="map__nav">
        <?php foreach ($maps as $key => $map) { ?>
          <h2 class="map__nav-item" data-map="<?php echo $map->id; ?>"><?php echo $map->title; ?></h2>    
        <?php } ?>
      </div>

    </div>

    <div class="map__container">

      <?php foreach ($maps as $key => $map) { ?>

        <div id="<?php echo $map->id ?>" 
          class="map" 
          data-url="<?php echo $map->img; ?>">
          <div class="marker__container">
            <?php foreach($map->markers as $key => $marker) { ?>
              <span class="marker" data-marker='<?php echo $marker; ?>'></span>
            <?php } ?>
          </div>
        </div>
      <? } ?>
    </div>
  
  
  </div>


  <!-- Photo Frame -->
  <div class="photo single-marker">
    <div class="photo__thumbnail-back"></div>
    <canvas id="photo" class="photo__canvas"></canvas>

    <div class="photo__sidebar">
      <button class="photo__sidebar-close"><i class="material-icons">keyboard_arrow_right</i></button>
      <div class="photo__sidebar-body">
        <h1 class="photo__sidebar-title">Photo 1</h1>
        <div class="photo__sidebar-content">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec faucibus elit ut vehicula commodo. Praesent non metus risus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent eget placerat massa, sed finibus tellus. Praesent sed velit eleifend, facilisis tortor in, elementum massa. Phasellus vestibulum nisi ac mauris gravida, a eleifend lacus commodo. Proin sagittis, nunc sed ullamcorper elementum, leo lacus pellentesque risus, vitae vehicula mi eros vitae massa.</p>
          <p>
        </div>
      </div>
    </div>
  </div>


</div>