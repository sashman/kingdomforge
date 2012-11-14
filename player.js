var Player = function(game_instance, player_instance){
	return({

// id refers to the specific object, group is the group it's in for rendering purposes, tileset is where the graphics come from
    id: 'player_id',
    group: 'player',
    tileset: 'player_tiles',

    

    //colh:AkihabaraGamebox.getTiles('player_tiles').tileh,
 
    // the initialize function contains code that is run when the object is first created. In the case of the player object this only happens once, at the beginning of the game, or possibly after a player dies and respawns.
    initialize: function() {
	      // Here we're just telling it to initialize the object, in this case our player.
	      AkihabaraTopview.initialize(this, {});
	     
	      // ** New code for Part 3 **
	      // And we set the starting position for our player.
	      this.x = 20;
	      this.y = 20;

		var anim_speed = 2;
		// Here we define the list of animations. We can name these whatever we want.
		  // These are referenced with this.animList[id].
		  // So for example, this.animList[rightDown].frames[1] would return 12.
		  this.animList = {
		    still:     { speed: 1, frames: [0]     },
		    right:     { speed: anim_speed, frames: [8,9,10,11,12,13,14,15] },
		    //rightDown: { speed: 3, frames: [2, 12] },
		    down:      { speed: anim_speed, frames: [24,25,26,27,28,29,30,31] },
		    //downLeft:  { speed: 3, frames: [4, 14] },
		    left:      { speed: anim_speed, frames: [0,1,2,3,4,5,6,7] },
		    //leftUp:    { speed: 3, frames: [6, 16] },
		    up:        { speed: anim_speed, frames: [16,17,18,19,20,21,22,23] },
		    //upRight:   { speed: 3, frames: [8, 18] }
		  };
		 
		  // Set the starting animation for the player object.
		  this.animIndex = 'still';

    	},

    //converting function
    set_pos: function(pos){
    	this.x = pos.x;
    	this.y = pos.y;
    },
 
    // the first function is like a step function. it runs every frame and does calculations. it's called first because it happens before the rendering, so we calculate new positions and actions and THEN render the object
    first: function() {
      // Toys.topview.controlKeys sets the main key controls. In this case we want to use the arrow keys which
	  //  are mapped to their english names. Inside this function it applies acceleration values to each of these directions
	  AkihabaraTopview.controlKeys(this, { left: 'left', right: 'right', up: 'up', down: 'down' });

	  //set speed
	  //AkihabaraTopview.setStaticSpeed(this, 2.5);

		// The if statements check for accelerations in the x and y directions and whether they are positive or negative. It then sets the animation index to the keyword corresponding to that direction.
	  if (this.accx == 0 && this.accy == 0) this.animIndex = 'still';
	  if (this.accx > 0 && this.accy == 0){
		this.animIndex = 'right';
		this.animList.still.frames = [8];
		}
	  
	  if (this.accx == 0 && this.accy > 0){
		this.animIndex = 'down';
		this.animList.still.frames = [24];
		}
	  
	  if (this.accx < 0 && this.accy == 0){
		this.animIndex = 'left';
		this.animList.still.frames = [0];
		}
	  
	  if (this.accx == 0 && this.accy < 0){
		this.animIndex = 'up';
		this.animList.still.frames = [16];
		}
	  
	 
	  // Set the animation.
	  if (frameCount%this.animList[this.animIndex].speed == 0)
	    this.frame = AkihabaraGamebox.decideFrame(frameCount, this.animList[this.animIndex]);
	 
	  // This adds some friction to our accelerations so we stop when we're not accelerating, otherwise our game would control like Asteroids
	  // AkihabaraTopview.handleVelocity(this);
	  AkihabaraTopview.handleAccellerations(this);
	 
	  // This tells the physics engine to apply those forces
	  AkihabaraTopview.applyForces(this);

	  AkihabaraTopview.tileCollision(this, map, 'map', null, { tolerance: 2, approximation: 3 });

	  checkBoundary(this);

    },
 
    // the blit function is what happens during the game's draw cycle. everything related to rendering and drawing goes here
    blit: function() {
      // Clear the screen.
	  //gbox.blitFade(gbox.getBufferContext(),{});
	 
	  // Render the current sprite.. don't worry too much about what's going on here. We're pretty much doing
	  //  the default drawing function, sending along the tileset, the frame info, coordinates, whether the
	  //  spries is flipped, camera info, and the alpha transparency value
	  AkihabaraGamebox.blitTile(AkihabaraGamebox.getBufferContext(), {
	    tileset: this.tileset,
	    tile:    this.frame,
	    dx:      this.x,
	    dy:      this.y,
	    fliph:   this.fliph,
	    flipv:   this.flipv,
	    camera:  this.camera,
	    alpha:   1.0
	  });
    }

});}