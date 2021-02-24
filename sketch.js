var START = 2;
var PLAY = 1;
var END = 0;
var gameState = START;

var playSettings;

var runner;
var jumpingAnimation;
var runningAnimation;

var gameOver = false;

var gameBackground;
var platformBackground;

var walkSound;
var gameMusic;
var gameOverMusic;
var jumpSound;

var gameFont;

var platformsGroup;

var gravity = 1;

var jumpPower = 15;

var runnerSpeed = 15;

var currentBackgroundTilePosition;
var backgroundTiles;

var playerScore = 0;

var currentPlatformLocation;



function preload() {
  
  jumpingAnimation = loadAnimation("womanImages/jump00.png", "womanImages/jump01.png", "womanImages/jump02.png", "womanImages/jump03.png", "womanImages/jump04.png", "womanImages/jump05.png", "womanImages/jump06.png", "womanImages/jump07.png", "womanImages/jump08.png", "womanImages/jump09.png");
  stillImage = loadImage("womanImages/run05.png");
  runningAnimation = loadAnimation("womanImages/run01.png", "womanImages/run02.png", "womanImages/run03.png", "womanImages/run04.png", "womanImages/run05.png", "womanImages/run06.png", "womanImages/run07.png", "womanImages/run08.png");
  
  
  
  gameBackground = loadImage("desertImages/desertBackground.png");
  platformBackground = loadImage("desertImages/desertPlatform.png");
  
  jumpSound = loadSound("sound/jumpSound.mp3");
  gameMusic = loadSound("sound/gameMusic.mp3");
  
  gameFont = loadFont("gameFont.TTF");
  
}



function setup() {
  
  createCanvas(840,390);
  
  
  
  runner = createSprite(50,100,25,40);
  runner.depth = 4;
  runner.addImage(stillImage);
  runner.addAnimation('jump', jumpingAnimation);
  runner.addAnimation('run', runningAnimation);
  runner.setCollider("rectangle", 0, 0, (runner.width), (runner.height) );
  
  
  playSettings = createSprite(420, 10, 30, 30);
  playSettings.shapeColor = "Red";
  
  platformsGroup = new Group();
  
  currentBackgroundTilePosition = -width;
  backgroundTiles = new Group();
  
  gameMusic.loop();
  
  platformsGroup.removeSprites();
  backgroundTiles.removeSprites();
  gameOver = false;
  updateSprites(true);
  runnerSpeed = 15;
  runner.x = 50;
  runner.y = 50;
  runner.velocity.x = runnerSpeed;
  currentPlatformLocation = -width;
  currentBackgroundTilePosition = -width;  
  playerScore = 0;
  addNewPlatforms();
  
  //gameOverMusic.stop();
  gameMusic.stop();
  gameMusic.loop();
  
  gameState = START;
  
  runner.velocityX = runnerSpeed;
  
}



function draw() {
  
  background("White");
  
  drawSprites();
  
  if (gameState === START) {
    
    runner.velocityY = 0;
    runner.velocityX = 0;
    
    if (mousePressedOver(playSettings)) {
      
      playSettings.visible = false;
      gameMusic.stop();
      gameState = PLAY;
      gameMusic.loop();
      
    }
    
    
    
  }
  
  
  
  if (gameState === PLAY) {
    
    updateScore();
    
    runner.velocityY = runner.velocityY + 1.2;
    
    camera.position.x = runner.position.x + 300;
    
    runner.velocity.x = runnerSpeed;
    
    runner.visible = true;
    
    addNewBackgroundTiles();
    removeOldBackgroundTiles();
    fallCheck();
    addNewPlatforms();
    jumpDetection();
    
    if (runner.y > 390) {
      
      gameState = END;
        
      }
      
    }

  if (gameState === END) {
    
    gameOverText();
      
      if (keyWentDown("Space")) {
        
        newGame();
        gameState = PLAY;
        
  }
    
    
    
    
    
  }
  
  runner.collide (platformsGroup, solidGround);
  
  removeOldPlatforms();
  updateSprites(false);  
  
}



function addNewPlatforms() {
  
  if (platformsGroup.length < 4) {
    
    var currentPlatformLength = 1132;
    var platform = createSprite((currentPlatformLocation * 1.3), random(300,350), 1132, 336);
    
    platform.collide(runner);
    
    currentPlatformLocation += currentPlatformLength;
    platform.addAnimation('default', platformBackground);
    platform.depth = 3;
    platformsGroup.add(platform);
    
  }
  
}



function solidGround() {
  
  runner.velocity.y = 0;
  runner.changeAnimation("run");
  
  if (runner.touching.right) {
    
    runner.velocity.x = 0;
    runner.velocity.y += 30;
  }
}



function jumpDetection() {
  
  if (keyWentDown("Space") && runner.y > 105) {
    
    runner.changeAnimation("jump");
    runner.animation.rewind();
    runner.velocity.y = -jumpPower;
    
    jumpSound.play();
    
  }
  
}



function addNewBackgroundTiles() {
  
  if (backgroundTiles.length < 3) {
    
    currentBackgroundTilePosition += 839;
    
    var bgLoop = createSprite(currentBackgroundTilePosition, height/2, 840, 390);
    
    bgLoop.addAnimation('bg', gameBackground);
    bgLoop.depth = 1;
    backgroundTiles.add(bgLoop);
  }
}



function removeOldBackgroundTiles() {
  
 
  
  for (var i = 0; i < backgroundTiles.length; i++) {
    
      if ((backgroundTiles [i] .position.x) < runner.position.x-width) {
        
        backgroundTiles [i] .remove();
        
    }
    
  }
  
}



function fallCheck() {
  
  if (runner.position.y > height) {
    
    gameState = END;
    
    gameMusic.stop();
    //gameOverMusic.loop();
    
    platformsGroup.destroyEach();
    runner.velocityX = 0;
    
    
  }
  
}



function gameOverText() {
  
  background(0,0,0,10);
  fill('white');
  stroke('black')
  textAlign(CENTER);
  textFont(gameFont);
  text.depth = 7;
  
  strokeWeight(2);
  textSize(90);
  strokeWeight(10);
  text("GAME OVER", camera.position.x, camera.position.y);
  
  textSize(15);
  text("Press `SPACE` to restart", camera.position.x, camera.position.y + 100);
  
  textSize(20);
  text("You ran " + playerScore + ' yards!', camera.position.x, camera.position.y + 50);
  
}



function newGame() {
  
  platformsGroup.removeSprites();
  backgroundTiles.removeSprites();
  gameOver = false;
  updateSprites(true);
  runnerSpeed = 15;
  runner.x = 50;
  runner.y = 50;
  runner.velocity.x = runnerSpeed;
  currentPlatformLocation = -width;
  currentBackgroundTilePosition = -width;  
  playerScore = 0;
  addNewPlatforms();
  
  //gameOverMusic.stop();
  gameMusic.loop();
  
  gameState = START;
  
  runner.velocityX = runnerSpeed;
  
}



function updateScore() {
  
  if (frameCount % 60 === 0) {
    
    playerScore++;
    
  }
  
  fill('white');
  strokeWeight(2);
  stroke('black');
  textFont(gameFont);
  textSize(20);
  textAlign(CENTER);
  text(playerScore, camera.position.x + 350, camera.position.y + 160);
  
}



function removeOldPlatforms() {
  
  for (var i = 0; i < platformsGroup.length; i++) {
    
    if ((platformsGroup [i] .position.x) < runner.position.x-width) {
      
      platformsGroup [i] .remove();
      
    }
    
  }
  
}
