var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ground,ground_Image,invisible_ground;

var obstaclesGroup,obstacle1,obstacle2,obstacle3,obstacle4;

var mario,marioImg;

var gameOver, restart;

var jumpSound,dieSound,checkpointSound;

var score;
 

localStorage[".HighestScore"] = 0;

function preload(){
  
  ground_Image=loadImage("Background.png");
  obstacle1=loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  
  marioImg = loadImage("mario.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  ground=createSprite(windowWidth/2,windowHeight-400,windowWidth,10);
  ground.shapeColor="white";
ground.addImage("ground_Image",ground_Image);
ground.scale =  2;
ground.x=width/2;
   ground.velocityX=-1;
  
   mario = createSprite(20,height-150,20,50);
  mario.addImage (marioImg);
  mario.scale = 0.09;
  //mario.setCollider("Circle",windowWidth,windowHeight-150,40);
  gameOver = createSprite(windowWidth/2,windowHeight/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(windowWidth/2,windowHeight/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 1;
  restart.scale = 0.5;
  
  invisible_ground=createSprite(windowWidth/2,windowHeight-150,windowWidth,10);
  invisible_ground.visible=false;
  
score = 0;
  
 

  obstaclesGroup = new Group();
}
function draw() {
  background("black");
  
  
  
  
   if (gameState===PLAY){
     
     
     ground.velocityX = -(4 + 3* score/100);
     
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
      score = score + Math.round(getFrameRate()/60);
  
     
    gameOver.visible=false;
    restart.visible=false;
  
     
     if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
     
     if((touches.length > 0) || (keyDown("space") && mario.y >= 240)) {
    mario.velocityY = -12;
    jumpSound.play();
     touches=[];  
  }  
  
     
     
  if (mario.isTouching(obstaclesGroup)){
    gameState=END;
     dieSound.play();
  }
  spawnObstacles();
   
     
   }
    
  else if ( gameState===END) {
  gameOver.visible=true;
  restart.visible=true;
  ground.velocityX = 0;
     mario.velocityY = 0
    
    obstaclesGroup.setVelocityXEach(0);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    
  }
  
  
   mario.velocityY = mario.velocityY + 0.8

   mario.collide(invisible_ground);
  
  if( touches.length>0 || mousePressedOver(restart)) {
      reset();
      touches=[];    
    }
  
  drawSprites();
  
  text("Score: "+ score,500,50);
  
  
  fill("lightpink");
  textSize(20);
}



function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(windowWidth/2,windowHeight-165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    obstacle.visible = true;
    
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
       default: break;
       
       
    }
    
    //assign scale and lifetime to the obstacle           
   obstacle.scale = 0.10;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.setVelocityXEach(0);
  obstaclesGroup.destroyEach(0);
  
  if(localStorage[".HighestScore"]<score){
    localStorage[".HighestScore"] = score;
  }
  
  score =0;
}
