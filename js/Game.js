/**
 * Game Static Class
 */
class Game {
    constructor() { }

    static init() {
        Game.gameStatus = 1;

        /**
         * Aliases
         */
        Game.Container = PIXI.Container;
        Game.autoDetectRenderer = PIXI.autoDetectRenderer;
        Game.loader = PIXI.Loader.shared;
        Game.resources = PIXI.Loader.shared.resources;
        Game.Sprite = PIXI.Sprite;
        Game.TextureCache = PIXI.utils.TextureCache;
        Game.BaseTexture = PIXI.BaseTexture;
        Game.Texture = PIXI.Texture;
        Game.Graphics = PIXI.Graphics;
        Game.Rectangle = PIXI.Rectangle;
        Game.TilingSprite = PIXI.TilingSprite;
        Game.MovieClip = PIXI.MovieClip;

        Game.stage = {
            width: window.innerWidth,
            height: window.innerHeight,
            margin: 10,
            container: new Game.Container()
        };

        Game.tick = 0;
        Game.enemiesInfo = {
            delay: 15,
            max: 5
        };

        Game.cloudInfo = {
            delay: 5,
            max: 50
        };

        Game.bullets = [];
        Game.enemies = [];
        Game.clouds = [];
        Game.boss;
        Game.EnemiesStopped = false;

        /**
         * Just for Fun.  Can remove later
         */
        var type = "WebGL";

        if (!PIXI.utils.isWebGLSupported()) {
            type = "canvas";
        }

        PIXI.utils.sayHello(type);
        /**
         * End Just for Fun.
         */

        Game.renderer = new Game.autoDetectRenderer({
            "width": Game.stage.width,
            "height": Game.stage.height
        });

        
        document.body.appendChild(Game.renderer.view);

        Game.assetsDir = "assets/images/";

        Game.layers = {
            background: new Game.Container(),
            enemies: new Game.Container(),
            bullets: new Game.Container(),
            boss:new Game.Container(),
            text: new Game.Container()
        };

        Game.textFont = {
            fontFamily: "Comic Sans MS",
            fontSize: 32,
            fill: "white",
            fontWeight: "bold"
        };

        Game.preload();
    }

    static preload() {
        let _onAssetsLoaded = (e, resources) => {
            Game.assets = resources;
            Game.setup();
        };

        /**
         * Load your Assets
         */
        Game.loader
            .add(`${Game.assetsDir}enemy.png`)
            .add(`${Game.assetsDir}bullet.png`)
            .add(`${Game.assetsDir}harry.png`)
            .add(`${Game.assetsDir}harry_hit.png`)
            .add(`${Game.assetsDir}darkmark.png`)
            .add(`${Game.assetsDir}bellatrix.png`)
            .add(`${Game.assetsDir}lightening_rotated.png`);

        Game.loader.load(_onAssetsLoaded);
    }

    static setup() {
        /**
         * Create the Game
         */
        for (let i in Game.layers) {
            Game.stage.container.addChild(Game.layers[i]);
        }

        Game.player = new Player({
            x: 50,
            y: this.stage.height / 2,
            speed: 5,
            scale: 0.3,
            level : 1
        });

        Game.text = {
            lifes: new PIXI.Text(`Lives : ${Game.player.lifes}`, this.textFont),
            score: new PIXI.Text(`Score : ${Game.player.score}`, this.textFont),
            level: new PIXI.Text(`Level : ${Game.player.level}`, this.textFont)
        };

        Game.text.lifes.position.set(20, 10);
        Game.text.score.position.set(Game.stage.width - 200, 10);
        Game.text.level.position.set(Game.stage.width/2, 10);
        Game.layers.text.addChild(Game.text.lifes);
        Game.layers.text.addChild(Game.text.score);
        Game.layers.text.addChild(Game.text.level);


        Game.loop();
    }

    static loop() {
        requestAnimationFrame(Game.loop);   // What does this do?

        switch(Game.gameStatus) {
            case 0:
                Game.menu();
                break;
            case 1:
                Game.play();
                break;
            case 2:
                Game.gameOver();
                break;
        }

        Game.tick++;
        Game.backgroundManager();
        Game.renderer.render(Game.stage.container);
    }

    static menu() {

    }

    static gameOver() {
        let text = new PIXI.Text(`Game Over!`, this.textFont);
        text.position.set((Game.stage.width / 2) - (text.width / 2), (Game.stage.height / 2) - (text.height / 2));
        Game.layers.text.addChild(text);
    }

    static play() {
        Game.contain(Game.player.sprite, {
            x: this.stage.margin,
            y: this.stage.margin, 
            width: this.stage.width - this.stage.margin, 
            height: this.stage.height - this.stage.margin
        });

        /**
         * Enemy Creation
         */

        if(!Game.EnemiesStopped){

            if(Game.tick % Game.enemiesInfo.delay === 0) {
                let enemy = new Enemy({
                    x: this.stage.width,
                    y: Math.floor((Math.random() * (this.stage.height - 20)) + 20),
                    speed: 4,
                    scale: 0.5
                });
            }
            }

        Game.player.update();

        for(let i in Game.bullets) {
            Game.bullets[i].update();
        }

        for(let j in Game.enemies) {
            Game.enemies[j].update();
        }

        Game.player.move();

        for(let i in Game.bullets) {
            Game.bullets[i].move();
        }

        for(let j in Game.enemies) {
            Game.enemies[j].move();
        }

        if(Game.EnemiesStopped){
            if(this.boss == undefined){
                this.boss = new Boss({
                    x: Game.stage.width,
                    y: 10,
                    speed: 4,
                    scale: 0.3
                });

            }
           
            this.boss.update();
            this.boss.move();
        }

        Game.text.lifes.text = `Lives : ${Game.player.lifes}`;
        Game.text.score.text = `Score : ${Game.player.score}`;
        Game.text.level.text = `Level : ${Game.player.level}`;
    }

    static contain(sprite, container) {
        /**
         * Left
         */
        if(sprite.x < container.x) {
            sprite.x = container.x;
        }

        /**
         * Top
         */
        if(sprite.y < container.y) {
            sprite.y = container.y;
        }

        /**
         * Right
         */
        if(sprite.x + sprite.width > container.width) {
            sprite.x = container.width - sprite.width;
        }

        /**
         * Bottom
         */
        if(sprite.y + sprite.height > container.height) {
            sprite.y = container.height - sprite.height;
        }
    }

    static backgroundManager() {
        if (Game.tick % Game.cloudInfo.delay === 0) {
            let cloud = new Cloud();
        }

        for (let j in Game.clouds) {
            /**
             * If the Cloud is Not Visible Anymore, Destroy it and Remove from the Array.
             */
            if (Game.clouds[j].container.position.x < Game.renderer.width * -1.3) {
                Game.clouds[j].destroy();
                Game.clouds.splice(j, 1);
            }
            else {
                Game.clouds[j].move();
            }
        }

       
    }


}