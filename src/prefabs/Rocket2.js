// Rocket prefab
class Rocket2 extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        
        this.sfxRocket = scene.sound.add('sfx_rocket');     //add rocket sfx

        // add object to the existing scene
        scene.add.existing(this);
        this.isFiring = false;         // tranck rocket firing status
        this.moveSpeed = 2;            // pixels per frame
       
    }

    update() {
        // left/right movement
        // Allow the player to control the Rocket after it's fired
            if(keyA.isDown && this.x >= 47) {
                this.x -= this.moveSpeed;
            } else if (keyD.isDown && this.x <= 578) {
                this.x += this.moveSpeed;
            }
        

        // fire button
        if(Phaser.Input.Keyboard.JustDown(keyW) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();      //play sfx
        }


        // if fired, move the rocket up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }
        // reset on miss
        if(this.y <= borderUISize *3 + borderPadding) {
            this.reset();
        }
    }

    // reset rocket to "ground"
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding - 60;
    }
}