import p5 from 'p5';
import { P5WrapperType } from '../library/p5Wrapper';

// 星を生成する
export const initStars = (p5: p5, count: number) => {
  const stars: Array<[number, number, number]> = [];
  Array.from(Array(count).keys()).forEach(() => {
    stars.push([
      p5.random(p5.width),
      p5.random(p5.height / 2),
      p5.random(1, 4),
    ]);
  });
  return stars;
};

export type Explosion = {
  fire: () => void;
  getType: () => FireType;
  incrementsFrame: () => void;
  getProps: () => FireProperties;
  setProps: (props: FireProperties) => void;
};

type AfterImage = {
  rsImage: () => void;
  exImage: () => void;
  getAlpha: () => number;
};
type FireType = 'rising' | 'explosion' | 'finished';
type FireProperties = {
  type: FireType;
  frame: number;
  next: number;
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  a: number;
  w: number;
  maxHeight: number;
  fireHeight: number;
  vx: number;
  vy: number;
  gv: number;
  exDelay: number;
  large: number;
  ball: number;
  exend: number;
  exStop: number;
  afterImages: Array<AfterImage>;
  explosions: Array<Explosion>;
};

// 花火を生成する
export const createFireWork = (
  p5: P5WrapperType,
  x: number,
  y: number,
  vx: number,
  vy: number,
  gv: number,
  r?: number,
  g?: number,
  b?: number
) => {
  const maxHeight = p5.random(p5.height / 6, p5.height / 2);
  let properties: FireProperties = {
    type: 'rising',
    // フレームカウンター
    frame: 0,
    next: 0,
    // 初期位置
    x,
    y,
    // 花火の色
    r: r || p5.random(155) + 80,
    g: g || p5.random(155) + 80,
    b: b || p5.random(155) + 80,
    a: 255,
    // 玉の大きさ
    w: p5.random(8, 5),
    // 打ち上がる高さ
    maxHeight,
    fireHeight: p5.height - maxHeight,
    // 重力
    vx,
    vy,
    gv,
    // 消えてから爆発までの遅延時間
    exDelay: p5.random(10, 40),
    // 爆発の大きさ
    large: p5.random(5, 15),
    // 爆発の玉の数
    ball: p5.random(20, 300),
    // 爆発から消えるまでの長さ
    exend: p5.random(20, 40),
    // 爆発のブレーキ
    exStop: 0.96,
    // 残像表示用配列
    afterImages: [],
    // 爆発用配列
    explosions: [],
  };

  // 打ち上げアニメーション
  const rising = () => {
    // 頂点まで達したら消す
    if (properties.y * 0.8 < properties.maxHeight) {
      properties.a = properties.a - 6;
    }

    // 指定の高さまで上昇する
    properties.x += properties.vx;
    properties.y -=
      properties.vy *
      ((properties.fireHeight - (p5.height - properties.y)) /
        properties.fireHeight);

    // 残像を表示
    properties.afterImages.push(createAfterImage(p5, properties));
    properties.afterImages.forEach((ai) => {
      if (ai.getAlpha() <= 0) {
        properties.afterImages = properties.afterImages.filter((n) => n !== ai);
      } else {
        ai.rsImage();
      }
    });

    // 打ち上げ表示
    fireWorkUpdate(p5, properties);

    // 全ての表示が消えたら処理の種類を変更する
    if (0 === properties.afterImages.length) {
      if (0 === properties.next) {
        // 消えてから爆発まで遅延させる
        properties.next = properties.frame + Math.round(properties.exDelay);
      } else if (properties.next === properties.frame) {
        // 花火の大きさ
        Array.from(Array(Math.round(properties.ball)).keys()).forEach(() => {
          // 爆発の角度
          let r = p5.random(0, 360);
          // 花火の内側を作る（バラバラ）
          let s = p5.random(0.1, 0.9);
          let vx = Math.cos((r * Math.PI) / 180) * s * properties.large;
          let vy = Math.sin((r * Math.PI) / 180) * s * properties.large;
          properties.explosions.push(
            createFireWork(
              p5,
              properties.x,
              properties.y,
              vx,
              vy,
              properties.exStop,
              properties.r,
              properties.g,
              properties.b
            )
          );
          // 花火の輪郭を作る（丸くなるようにする）
          let cr = p5.random(0, 360);
          let cs = p5.random(0.9, 1);
          let cvx = Math.cos((cr * Math.PI) / 180) * cs * properties.large;
          let cvy = Math.sin((cr * Math.PI) / 180) * cs * properties.large;
          properties.explosions.push(
            createFireWork(
              p5,
              properties.x,
              properties.y,
              cvx,
              cvy,
              properties.exStop,
              properties.r,
              properties.g,
              properties.b
            )
          );
        });
        properties.a = 255;
        properties.type = 'explosion';
      }
    }
  };

  // 爆発アニメーション
  const explosion = () => {
    properties.explosions.forEach((explosion) => {
      explosion.incrementsFrame();
      // 爆発し終わった花火を配列から除去する
      if ('finished' === explosion.getType()) {
        properties.explosions = properties.explosions.filter(
          (n) => n !== explosion
        );
        return;
      }

      // 残像を描画
      if (0 === Math.round(p5.random(0, 32))) {
        const newProps = explosion.getProps();
        newProps.afterImages.push(createAfterImage(p5, newProps));
        explosion.setProps(newProps);
      }

      explosion.getProps().afterImages.forEach((ai) => {
        if (ai.getAlpha() < 0) {
          let newProps = explosion.getProps();
          newProps.afterImages = newProps.afterImages.filter((n) => n !== ai);
          explosion.setProps(newProps);
        } else {
          ai.exImage();
        }
      });

      // 爆発を描画
      fireWorkUpdate(p5, explosion.getProps());
      const newProps = explosion.getProps();
      newProps.x += newProps.vx;
      newProps.y += newProps.vy;
      newProps.vx = newProps.vx * newProps.gv;
      newProps.vy = newProps.vy * newProps.gv;
      newProps.vy = newProps.vy + newProps.gv / 30;
      if (properties.exend < newProps.frame) {
        newProps.w -= 0.1;
        newProps.a = newProps.a - 4;
        if (newProps.a < 0 && 0 === newProps.afterImages.length) {
          newProps.type = 'finished';
        }
      }
      explosion.setProps(newProps);
    });
  };

  // 花火を表示する
  const fireWorkUpdate = (p5: P5WrapperType, props: FireProperties) => {
    props.frame++;
    if (0 < props.a) {
      let c = p5.color(props.r, props.g, props.b);
      c.setAlpha(props.a);
      p5.fill(c);
      p5.ellipse(props.x, props.y, props.w, props.w);
    }
  };

  return {
    fire: () => {
      if (properties.type === 'rising') {
        rising();
      }
      if (properties.type === 'explosion') {
        explosion();
      }
    },
    getType: () => properties.type,
    incrementsFrame: () => properties.frame++,
    getProps: () => properties,
    setProps: (props: FireProperties) => (properties = props),
  };
};

// 残像処理
const createAfterImage = (p5: P5WrapperType, props: FireProperties) => {
  let properties = {
    frame: 0,
    r: props.r,
    g: props.g,
    b: props.b,
    x: props.x,
    y: props.y,
    w: props.w,
    a: props.a,
    vx: p5.random(-0.24, 0.24),
    vy: p5.random(0.2, 0.8),
    vw: p5.random(0.05, 0.2),
  };

  // 打ち上げ用
  const rsImage = () => {
    if (0 < properties.a) {
      update();
      properties.r += 4;
      properties.g += 4;
      properties.b += 4;
      properties.x = properties.x + properties.vx;
      properties.y = properties.y + properties.vy;
      if (0 < properties.w) {
        properties.w = properties.w - properties.vw;
      }
      properties.a = properties.a - 4;
    }
  };

  // 爆発用
  const exImage = () => {
    if (0 < properties.a) {
      update();
      properties.r += 2.5;
      properties.g += 2.5;
      properties.b += 2.5;
      properties.x = properties.x + properties.vx;
      properties.y = properties.y + properties.vy;
      if (0 < properties.w) {
        properties.w = properties.w - properties.vw;
      }
      properties.a = properties.a - 1.5;
    }
  };

  const update = () => {
    properties.frame++;
    const c = p5.color(properties.r, properties.g, properties.b);
    c.setAlpha(properties.a);
    p5.fill(c);
    p5.ellipse(properties.x, properties.y, properties.w, properties.w);
  };
  return {
    rsImage: () => rsImage(),
    exImage: () => exImage(),
    getAlpha: () => properties.a,
  };
};
