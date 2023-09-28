import { useRef, useEffect } from 'react';

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 5;
const BALL_SPEED = 4;

export default function Pong() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    let leftScore = 0;
    let rightScore = 0;
    let animationFrameId: number;

    const leftPaddle = {
      x: 10,
      y: canvas.height / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      dy: 2
    };

    const rightPaddle = {
      x: canvas.width - PADDLE_WIDTH * 2,
      y: canvas.height / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      dy: 2
    };

    const ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: BALL_RADIUS,
      dx: BALL_SPEED,
      dy: BALL_SPEED
    };

    // dessine ligne poitillee au centre
    function drawNet() {
      if (context) {
        const netWidth = 10;
        const netHeight = 10;
        const gap = 18;
        const numberOfDashes = canvas.height / (netHeight + gap);

        context.fillStyle = '#ffffff';
        for (let i = 0; i < numberOfDashes; i += 1) {
          context.fillRect(
            canvas.width / 2 - netWidth / 2,
            i * (netHeight + gap),
            netWidth,
            netHeight
          );
        }
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.code === 'ArrowUp') {
        leftPaddle.y -= leftPaddle.dy * 10;
        if (leftPaddle.y < 0) {
          leftPaddle.y = 0;
        }
      } else if (event.code === 'ArrowDown') {
        leftPaddle.y += leftPaddle.dy * 10;
        if (leftPaddle.y + leftPaddle.height > canvas.height) {
          leftPaddle.y = canvas.height - leftPaddle.height;
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    function resetCanvas() {
      if (context) {
        context.fillStyle = '#000000';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    // dessine la raquette
    function drawPaddle(x: number, y: number) {
      if (context) {
        context.fillStyle = '#ffffff';
        context.fillRect(x, y, 10, 100);
      }
    }

    // dessiner la balle
    function drawBall(x: number, y: number) {
      if (context) {
        context.beginPath();
        context.arc(x, y, ball.radius, 0, Math.PI * 2);
        context.fillStyle = '#ffffff';
        context.fill();
        context.closePath();
      }
    }

    // ligne de touche du haut
    function drawUpperLine() {
      if (context) {
        context.beginPath();
        context.lineWidth = 10;
        context.moveTo(0, 0);
        context.lineTo(canvas.width, 0);
        context.strokeStyle = '#ffffff';
        context.stroke();
      }
    }

    // ligne de touche du bas
    function drawLowerLine() {
      if (context) {
        context.beginPath();
        context.lineWidth = 10;
        context.moveTo(0, canvas.height);
        context.lineTo(canvas.width, canvas.height);
        context.strokeStyle = '#ffffff';
        context.stroke();
      }
    }

    // afficher le score
    function drawScore() {
      if (context) {
        context.fillStyle = '#ffffff';
        context.font = '50px Arial';
        context.fillText(String(leftScore), 500, 70);
        context.fillText(String(rightScore), 670, 70);
      }
    }

    let ballPaused = false;

    // fonction qui reset la balle quand un pt est marque
    function resetBall() {
      ballPaused = true;
      ball.x = -100; // Déplace la balle hors de vue
      ball.y = -100; // Déplace la balle hors de vue
      ball.dx = 0;
      ball.dy = 0;
      setTimeout(() => {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = (Math.random() < 0.5 ? -1 : 1) * 4;
        ball.dy = (Math.random() * 2 - 1) * 4;
        ballPaused = false;
      }, 2000);
    }

    // fonction pour ajuster l'angle de la balle selon ou touche la raquette
    function adjustBallAngle(paddleY, paddleHeight) {
      const relativeIntersectY = ball.y - (paddleY + paddleHeight / 2);
      const normalizedIntersectY = relativeIntersectY / (paddleHeight / 2);
      const bounceAngle = normalizedIntersectY * (45 * (Math.PI / 180));

      ball.dy = 4 * Math.sin(bounceAngle);
    }

    function draw() {
      resetCanvas();
      drawScore();
      drawUpperLine();
      drawLowerLine();
      drawNet();
      drawPaddle(leftPaddle.x, leftPaddle.y);
      drawPaddle(rightPaddle.x, rightPaddle.y);
      drawBall(ball.x, ball.y);

      if (!ballPaused) {
        // Collision avec raquette gauche
        if (
          ball.x - ball.radius < leftPaddle.x + leftPaddle.width &&
          ball.y + ball.radius > leftPaddle.y &&
          ball.y - ball.radius < leftPaddle.y + leftPaddle.height
        ) {
          ball.dx = -ball.dx;
          adjustBallAngle(leftPaddle.y, leftPaddle.height);
        }

        // Collision avec rauqtte droite
        if (
          ball.x + ball.radius > rightPaddle.x &&
          ball.y + ball.radius > rightPaddle.y &&
          ball.y - ball.radius < rightPaddle.y + rightPaddle.height
        ) {
          ball.dx = -ball.dx;
          adjustBallAngle(rightPaddle.y, rightPaddle.height);
        }

        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
          ball.dy = -ball.dy;
        }

        // check si la balle touche les parois, gere les pts et reset la pos de la balle
        if (ball.x + ball.radius > canvas.width) {
          // ball.dx = -ball.dx;
          leftScore += 1;
          resetBall();
        } else if (ball.x - ball.radius < 0) {
          // ball.dx = -ball.dx;
          rightScore += 1;
          resetBall();
        }

        // deplacment de la balle
        if (!ballPaused) {
          ball.x += ball.dx * 2;
          ball.y += ball.dy;
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-[url('./images/background.png')] bg-cover">
      <canvas
        className="flex items-center rounded-lg shadow-lg"
        ref={canvasRef}
        width={1200}
        height={700}
      />
    </div>
  );
}
