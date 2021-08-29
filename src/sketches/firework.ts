import { P5WrapperType } from '../library/p5Wrapper';
import { createFireWork, Explosion, initStars } from './fireworkUtils';

export const firework = (p5: P5WrapperType) => {
  p5.state = [];
  p5.dispatch = () => {};

  const stars: Array<[number, number, number]> = [];
  let fireworks: Array<Explosion> = [];
  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight)
      .position(0, 0)
      .style('z-index', '-1')
      .style('position', 'fixed');
    p5.colorMode('rgb');
    p5.frameRate(60);

    stars.splice(0);
    stars.push(...initStars(p5, 100));
  };

  p5.draw = () => {
    p5.noFill();
    // bg gradient
    Array.from(Array(p5.windowHeight).keys()).forEach((i) => {
      const inter = p5.map(i, 0, p5.windowHeight, 0, 1);
      const c = p5.lerpColor(p5.color(0, 0, 0), p5.color(24, 32, 72), inter);
      p5.stroke(c);
      p5.line(0, i, p5.windowWidth, i);
    });
    p5.noStroke();

    // draw stars
    stars.forEach((s) => {
      const c = p5.color(p5.random(150, 255), p5.random(150, 255), 255);
      c.setAlpha(p5.random(150, 200));
      p5.fill(c);
      p5.ellipse(s[0], s[1], s[2], s[2]);
    });

    // 花火を打ち上げる間隔を調整
    if (p5.state && p5.dispatch) {
      if (0 === p5.frameCount % 100 && p5.state.length > 0) {
        const fw = p5.state[0];
        const speed = p5.random(10, 30);
        fireworks.push(
          createFireWork(
            p5,
            p5.random(p5.width),
            p5.height,
            0,
            speed,
            0.98,
            fw.color.r,
            fw.color.g,
            fw.color.b
          )
        );
        p5.dispatch({
          type: 'SHIFT_FIREWORK',
        });
      }
    }

    for (const fw of fireworks) {
      // 打ち切った花火を処理対象から外す（配列から削除する）
      if ('finished' === fw.getType() || 30000 < fw.getProps().frame) {
        fireworks = fireworks.filter((n) => n !== fw);
        continue;
      }

      // 打ち上げアニメーションを呼び出す
      fw.fire();
    }
  };
};
