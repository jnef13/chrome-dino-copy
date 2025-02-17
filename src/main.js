// Required stuff
import kaplay from "kaplay";

const k = kaplay();

// World "settings "
const GRAVITY = 1700;
const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 480;

// Load all sprites/assets
loadSprite("dino", "sprites/dino.png");

scene("game", () => {
    setGravity(GRAVITY);

    // Add the player to the scene
    const player = add([
        sprite("dino"),
        pos(80, 40),
        area(),
        body(),
    ]);

    // Add a floor so the character dosn't fall indefinately
    add([
        rect(width(), FLOOR_HEIGHT),
        outline(4),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        color(127, 200, 255),
    ]);

    // Implement a basic jump function
    function jump() {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    }
    onKeyPress("space", jump);
    onClick(jump);

    // Add the "obstacle", and include spawning mechanics
    function spawnFist() {
        add([
            rect(48, rand(32, 96)),
            area(),
            outline(4),
            pos(width(), height() - FLOOR_HEIGHT),
            anchor("botleft"),
            color(255, 180, 255),
            move(LEFT, SPEED),
            "fist",
        ]);
        wait(rand(0.65, 1.5), spawnFist);
    }
    spawnFist();

    // Implement a game-over system, so the player actually loses.
    player.onCollide("fist", () => {
        go("lose", score);
        burp();
        addKaboom(player.pos);
    });

    // Implement a basic score syste,
    let score = 0;

    const scoreLabel = add([text(score), pos(24, 24)]);

    onUpdate(() => {
        score++;
        scoreLabel.text = score;
    });
});

// Lose screen sys, extended from the game over sys.
scene("lose", (score) => {
    add([
        sprite("dino"),
        pos(width() / 2, height() / 2 - 80),
        scale(2),
        anchor("center"),
    ]);

    add([
        text(score),
        pos(width() / 2, height() / 2 + 80),
        scale(2),
        anchor("center"),
    ]);

    onKeyPress("space", () => go("game"));
    onClick(() => go("game"));
});

go("game");