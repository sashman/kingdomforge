<html>
<!--- Main game page -->
<?php $akihabara_dir = "../akihabara-core-1.3.1/akihabara"?>
<head>
  <script type="text/javascript" src="<?php echo $akihabara_dir?>/gbox.js"></script>
  <script type="text/javascript" src="<?php echo $akihabara_dir?>/iphopad.js"></script>
  <script type="text/javascript" src="<?php echo $akihabara_dir?>/trigo.js"></script>
  <script type="text/javascript" src="<?php echo $akihabara_dir?>/toys.js"></script>
  <script type="text/javascript" src="<?php echo $akihabara_dir?>/help.js"></script>
  <script type="text/javascript" src="<?php echo $akihabara_dir?>/tool.js"></script>
  <script type="text/javascript" src="<?php echo $akihabara_dir?>/gamecycle.js"></script>
  <style>BODY { -webkit-user-select: none; margin: 0px }</style>
  <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" />
</head>
  <body></body>
  <script>
  var maingame;
  
  window.addEventListener('load', loadResources, false);
  
  function loadResources() {
	  // This initializes Akihabara with the default settings.
	  // The title (which appears in the browser title bar) is the text we're passing to the function.
	  help.akihabaraInit('8by5');
	 
	  // Here we tell the game to look for an image called 'font.png' in the same directory as the HTML file and call it 'font' internally
	  gbox.addImage('font', 'font.png');
	 
	  // Same thing for our logo here.
	  gbox.addImage('logo', 'logo.png');
	 
	  // Fonts are mapped over an image, setting the first letter, the letter size, the length of all rows of letters and a horizontal/vertical gap.
	  gbox.addFont({ id: 'small', image: 'font', firstletter: ' ', tileh: 8, tilew: 8, tilerow: 255, gapx: 0, gapy: 0 });
	 
	  // When everything is ready, the 'loadAll' downloads all the needed resources, and then calls the function "main".
	  gbox.loadAll(main);
	}
	
	function main() {
		gbox.setGroups(['game']);
		maingame = gamecycle.createMaingame('game', 'game');
 
	// We'll add more here in the next step...
 
		gbox.go();
	}
  
  </script>
</html