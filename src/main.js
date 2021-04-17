//game configuration
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3; 

//reserve keyboard vars
let keyUP, keyLEFT, keyRIGHT, keyA , keyD, keyW, keyR;

let highScore = 0;





