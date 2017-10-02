'use strict';

const Player = require('../entity/Player');
const Enemy = require('../entity/NPC');

let Play = {};

Play.init = function() {

};

Play.create = function() {
    // Anand did this part. I don't even know.
    this.map = game.add.tilemap('map1');
    this.map.addTilesetImage('outdoors', 'tileset');
    this.bgLayer = this.map.createLayer('bgLayer');
    this.bgOverlap = this.map.createLayer('bgOverlap');
    this.bgOverlap2 = this.map.createLayer('bgOverlap2');
    this.blockOverlap = this.map.createLayer('blkOverlap');
    this.blockLayer = this.map.createLayer('blkLayer');
    game.add.existing(this.blockLayer);
    this.map.setCollisionBetween(1, 10000, true, this.blockLayer);
    this.map.setCollisionBetween(1, 10000, true, this.blockOverlap);
    this.blockLayer.resizeWorld();
    this.bgLayer.resizeWorld();

    // Input for game
    this.keyboard = game.input.keyboard;

    /**
     * Create the Player, setting location and naming as 'player'.
     * Giving him Physics and allowing collision with the world boundaries.
     */
    this.player = new Player(window.innerWidth/2, window.innerHeight/2, 'player');

    // Creating the enemy. Same procedure for as the player.
    this.enemy = new Enemy(window.innerWidth - 50, window.innerHeight/2 + 50, 'enemy');

    game.camera.follow(this.player);
};

let newDirection = 2, collideDir = '', collideDirNPC = 0;
let attacking = false, collide = false;
Play.update = function() {  
    /**
     * NPC Code
     */
    // Intersection for NPC
    game.physics.arcade.collide(this.enemy, this.blockLayer, npcCollision, null, this);
    game.physics.arcade.collide(this.enemy, this.blockOverlap);

    /**
     * Generate random number 1-4 to be the new enemy direction.
     * This value is used to calculate the NPC's decision to change
     * directions. According to this, 1 out of 50 chance. 
     */
    let rand;
    rand = Math.round(Math.random() * 50) + 1;
    if (rand === 1) {
        rand = Math.round(Math.random() * 4) + 1;
        if (rand !== collideDirNPC) newDirection = rand;
    }

    // Moving the enemy in a direction based on the generated number.
    switch (newDirection) {
        case 1: // Straight Up
            this.enemy.moveInDirection('up', false);
            break;
        case 2: // Straight Right
            this.enemy.moveInDirection('right', false);
            break;
        case 3: // Straight Down
            this.enemy.moveInDirection('down', false);
            break;
        case 4: // Straight Left
            this.enemy.moveInDirection('left', false);
            break;
    }


    /**
     * PLAYER CODE
     */

    // Displays the hitbox for the Player
    game.debug.body(this.player);

    // // SHIFT for running
    // let sprint = false;
    // if ( this.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
    //   sprint = true;
    // }

    // //Moving the player, but only if you aren't attacking.
    // if (!attacking){
    //     if ( this.keyboard.isDown(Phaser.Keyboard.W)) {
    //         this.player.moveInDirection('up', sprint);
    //     } else if ( this.keyboard.isDown(Phaser.Keyboard.S)) {
    //         this.player.moveInDirection('down', sprint);
    //     } else if ( this.keyboard.isDown(Phaser.Keyboard.A)) {
    //         this.player.moveInDirection('left', sprint);
    //     } else if ( this.keyboard.isDown(Phaser.Keyboard.D)) {
    //         this.player.moveInDirection('right', sprint);
    //     } else {
    //         this.player.idleHere();
    //     }
    // }

    // if (game.input.keyboard.isDown(Phaser.Keyboard.M) && !attacking) {            
    //     attacking = true;     
    //     this.player.attack();
    // }        
    // else {            
    //     //Checking to see if the animation is finished before stopping the attack.
    //     let temp = this.player.frame - 161;
    //     if (temp % 13 === 0) attacking = false;
    // }

    game.physics.arcade.collide(this.player, this.blockLayer, this.collide, null, this);
    game.physics.arcade.collide(this.player, this.blockOverlap);

    // Intersection for Player
    // this.game.physics.arcade.collide(this.player, this.blockLayer, playerCollision, null, this);
    // this.game.physics.arcade.collide(this.player, this.blockOverlap);

    // Deciding which character to render on top of the other.
    if ((this.player.y + this.player.height) > (this.enemy.y + this.enemy.height)) {
        game.world.bringToTop(this.player);
    } else {
        game.world.bringToTop(this.enemy);
    }
};

/**
 * 
 * 
 */
function playerCollision() {
    this.player.idleHere();
    collide = true;
    collideDir = this.player.direction;
}

/**
 * 
 * 
 */
function npcCollision() {
    this.enemy.idleHere();
    collideDirNPC = newDirection;
    newDirection = 0;
}

module.exports = Play;
