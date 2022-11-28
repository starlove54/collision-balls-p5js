// ball class
class Ball{
    constructor(radius, pos, vel , color){
        this.radius = radius;
        this.pos = pos;
        this.vel = vel;
        this.color = color;
    }

    // display ball
    render(){
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.radius*2);
    }

    collide(other){
        if(this == other){
            return;
        }
        //  d= r1 + r2 - |C2 - C1|
        // C2 - C1 
        let relativeDistVector = p5.Vector.sub(other.pos, this.pos);
        // d = penetration , lets calculate distance (scalar quantity)
        let dist = relativeDistVector.mag() - (other.radius + this.radius);
        // if collision happens
        if(dist < 0){
            // we will move the colliding balls by shift( collision resolution)
            let shift = relativeDistVector.copy().setMag(abs(dist/2));
            this.pos.sub(shift);
            other.pos.add(shift);

            // unit vector along line of collision 
            let collisionLineVector = relativeDistVector.copy().normalize();
            
            // approach speed 
            let approachSpeed  = this.vel.dot(collisionLineVector) + -other.vel.dot(collisionLineVector);

            // approach velocity
            let approachVelocity = collisionLineVector.copy().setMag(approachSpeed);

            this.vel.sub(approachVelocity);
            other.vel.add(approachVelocity);
        }
    }
    // move the balls
    move(){
        this.pos.add(this.vel);

        if(this.pos.x > width - this.radius ){
            this.pos.x = width - this.radius;
            this.vel.x = -this.vel.x;
        }

        if(this.pos.x < this.radius){
            this.pos.x = this.radius;
            this.vel.x = -this.vel.x;
        }

        if(this.pos.y > height - this.radius){
            this.pos.y = height - this.radius;
            this.vel.y = -this.vel.y;
        }

        if(this.pos.y < this.radius){
            this.pos.y = this.radius;
            this.vel.y = -this.vel.y;
        }
    } 
}

// initialize balls                   
let balls = [];
function setup(){
    createCanvas(600, 600);
    for(let i =0; i < 10; i++){
        balls.push(
            new Ball(
                random(5, 50),
                createVector(random(width), random(height)),
                p5.Vector.random2D().mult(random(10)),
                color(random(255),random(255),random(255))
            )
        )
    }
}

function draw(){
    if(frameCount === 1){
        capturer.start();
    }
    background(200);
    for(let i =0 ; i < balls.length; i++){
        for(let j =0; j < balls.length; j++){
            balls[i].collide(balls[j]);
        }
    }
    for(let i =0; i < balls.length; i++){
        balls[i].render();
        balls[i].move();
    }
    if(frameCount < 60*10){
        capturer.capture(canvas)
    }else if(frameCount === 60*10){
        capturer.save()
        capturer.stop()
    }
}