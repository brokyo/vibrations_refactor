import chroma from "chroma-js";

const s = sketch => {
  sketch.preload = () => {
    // sketch.font = sketch.loadFont("/src/assets/Abel-Regular.ttf");
  };

  sketch.setup = () => {
    sketch.colorMode(sketch.HSB);
    var canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    canvas.parent(`canvas-holder`);
    sketch.frameRate(30);
  };

  sketch.draw = () => {
    sketch.choirSections.forEach(choirSection => {
      if (choirSection.color.changing) {
        choirSection.color.iterator += choirSection.color.iteratorStep;
        choirSection.color.current = chroma.mix(
          chroma(choirSection.color.start),
          chroma(choirSection.color.end),
          choirSection.color.iterator,
          `hsv`
        );

        if (choirSection.color.iterator >= 1) {
          choirSection.color.changing = false;
          choirSection.color.iterator = 0;
        }
      }
    });

    let colors = [
      sketch.choirSections[0].color.current,
      sketch.choirSections[1].color.current,
      sketch.choirSections[2].color.current,
      sketch.choirSections[3].color.current
    ];

    let average = chroma.average(colors).hex();
    sketch.background(average);

    sketch.textFont(sketch.font);
    sketch.fill(255);

    sketch.textAlign(sketch.CENTER);
    if (sketch.activeCard === `performance`) {
      if (sketch.waveMeta.utterance.type == `short`) {
        sketch.textSize(45);
        sketch.text(
          sketch.waveMeta.utterance.text,
          sketch.windowWidth / 2,
          sketch.windowHeight / 3
        );
      } else if (sketch.waveMeta.utterance.type === `long`) {
        sketch.textSize(40);
        sketch.text(
          sketch.waveMeta.utterance.text,
          sketch.windowWidth * 0.25,
          sketch.windowHeight * 0.1,
          sketch.windowWidth / 2
        );
      }
    } else if (sketch.activeCard === `title`) {
      sketch.textSize(65);
      sketch.text(
        `awakening sytems: ${sketch.waveMeta.prefix}`,
        sketch.windowWidth / 2,
        sketch.windowHeight / 2
      );
    }

    sketch.textSize(20);
    sketch.text(average, sketch.windowWidth / 2, sketch.windowHeight - 40);
    // text('vibrations.awakening.systems', windowWidth / 2, windowHeight - 40)
  };

  sketch.windowResized = () => {
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
  };
};

export { s };
