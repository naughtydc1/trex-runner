var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex3_-removebg-preview.png","trex_2-removebg-preview.png","trex1_.-removebg-preview.png");
  trex_collided = loadAnimation("trex_2-removebg-preview.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  //cloudImage.scale = 0.0002;
  
  obstacle1 = loadImage("cactus-removebg-preview (3).png");
  obstacle2 = loadImage("rock-removebg-preview.png");
  obstacle3 = loadImage("dino-removebg-preview.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  bg = loadImage("t b.jpg");
  gameOverImg = loadImage("gameover-removebg-preview.png");
  restartImg = loadImage("restart_button-removebg-preview (1).png");
  restartImg.scale = 0.4;
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  trex.velocityX = 6 + 3*score/100;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.visible = false;
  //ground.x = ground.width /2;
  //ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(trex.x +220,70);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(trex.x+220,120);
  
  restart.addImage(restartImg);
  
  
  gameOver.scale = 0.5;
  restart.scale = 0.25;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
 // invisibleGround.velocityX = 7 + 3*score/100;
  invisibleGround.x = trex.x-20;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {

  camera.x = trex.x+220;
  //console.log(ground.x);
  //console.log(trex.x);
  gameOver.position.x = trex.position.x+220;
  restart.position.x = trex.position.x+220;
  //trex.debug = true;
  background(bg);
  textSize(15);
  stroke("black");
  fill("black");
  text("Score: "+ score, trex.x+420,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    //ground.velocityX = -(6 + 3*score/100);
    trex.velocityX = 6 + 3*score/100;
    invisibleGround.x = trex.x-20;
  
    if(keyDown("space") && trex.y >= 139) {
      trex.velocityY = -12.5;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < trex.x-150){
      ground.position.x = trex.position.x+650;
      
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.velocityX = 0;
    trex.y = 160;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(trex.x+520,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.visible = false;
    //cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(trex.x+520,170,10,40);
    var obstaclee = createSprite(trex.x+520,165,10,40);
    //obstacle.debug = true;
    //obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstaclee.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1;
    obstaclee.scale = 0.3;
    obstacle.lifetime = 300;
    obstaclee.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    obstaclesGroup.add(obstaclee);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}