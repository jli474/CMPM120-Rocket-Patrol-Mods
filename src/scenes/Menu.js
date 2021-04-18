class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/menu.wav');
        this.load.audio('sfx_explosion', './assets/die.wav');
        this.load.audio('sfx_rocket', './assets/fire.wav');
        // load image
        this.load.image('menu', './assets/Menu.png');
    }

    create() {
        
        // place menu
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'menu').setOrigin(0, 0);
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // easy mode
          game.settings = {
            spaceshipSpeed: 2,
            supershipSpeed: 3,
            gameTimer: 60000    
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // hard mode
          game.settings = {
            spaceshipSpeed: 3,
            supershipSpeed: 4,
            gameTimer: 45000    
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene');    
        }
        if(Phaser.Input.Keyboard.JustDown(keyW)) {
          // 2 player mode
          game.settings = {
              spaceshipSpeed: 4,
              supershipSpeed: 5,
              gameTimer: 45000,
              mode: 1
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene'); 
      }
    }


  }