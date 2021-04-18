class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('cat01', './assets/cat1.png');
        this.load.image('cat02', './assets/cat2.png');
        this.load.image('mouse01', './assets/Mouse01.png');
        this.load.image('fish', './assets/fish.png');
        this.load.image('floor', './assets/floor.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/die.png', {
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        });
    }

    create() {
        // place starfield
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'floor').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        // add rocket (p1)
        // add rocket (p2)
        if(game.settings.mode == 1) {
            this.p1Rocket = new Rocket(this, game.config.width/3, game.config.height - borderUISize - borderPadding - 55, 'cat01').setScale(1.2, 1.2).setOrigin(0.5, 0);
            this.p2Rocket = new Rocket2(this, game.config.width/1.5, game.config.height - borderUISize - borderPadding - 55, 'cat02').setScale(1.2, 1.2).setOrigin(0.5, 0);
        } else {
            this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding - 55, 'cat01').setScale(1.2, 1.2).setOrigin(0.5, 0);
        }
        

        // add spaceship (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'mouse01', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'mouse01', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'mouse01', 0, 10).setOrigin(0, 0);
        this.shipboss = new Supership(this, game.config.width + 50, borderUISize * 6, 'fish', 0, 60).setOrigin(0, 0);
        
        // define keys
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0
        this.p2Score = 0
        

        // dispaly score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top:5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig);
        
        this.scoreRight = this.add.text(500 , borderUISize + borderPadding * 2, highScore , scoreConfig);
        this.hScoreText = this.add.text(500, 17 , 'High', scoreConfig);
        

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(60000, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            
            this.gameOver = true;
        }, null, this);

    }

    update() {
        
        if(this.p1Score > highScore) {
            highScore = this.p1Score;
            this.scoreRight.text = highScore;
        }
        
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)){
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 3;

        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            if(game.settings.mode == 1) {
                this.p2Rocket.update();
            }
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.shipboss.update();
        } 

        // p1 checkCollision
        if(this.checkCollision(this.p1Rocket, this.shipboss)) {
            this.p1Rocket.reset();
            this.shipExplode(this.shipboss);   
        }    
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);   
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }

        // p2 checkCollision
        if(game.settings.mode == 1) {
            if(this.checkCollision(this.p2Rocket, this.shipboss)) {
                this.p2Rocket.reset();
                this.shipExplode(this.shipboss);   
            }    
            if(this.checkCollision(this.p2Rocket, this.ship03)) {
                this.p2Rocket.reset();
                this.shipExplode(this.ship03);   
            }
            if (this.checkCollision(this.p2Rocket, this.ship02)) {
                this.p2Rocket.reset();
                this.shipExplode(this.ship02);
            }
            if (this.checkCollision(this.p2Rocket, this.ship01)) {
                this.p2Rocket.reset();
                this.shipExplode(this.ship01);
            }
            
        }

    }

       
    

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
            } else {
                return false;
            }
        
    }

    shipExplode(ship) {
        this.sound.play('sfx_explosion');
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });
        
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score; 
        
        if(game.settings.mode == 1) {
            this.p2Score += ship.points;
            this.scoreLeft.text = this.p2Score;
        }
      }

      
}