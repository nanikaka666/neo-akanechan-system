import { useCallback, useEffect, useRef } from "react";
import { useIndicatorColor } from "../hooks/useIndicatorColor";
import { useWindowSize } from "../hooks/useWindowSize";
import { GoalsLevel } from "../../../../types/goals";

export interface GaugeProps {
  gaugeLevel: GoalsLevel;
  value: number;
  range: {
    min: number;
    max: number;
  };
}

export function Gauge({ gaugeLevel, value, range }: GaugeProps) {
  const [windowWidth, windowHeight] = useWindowSize();
  const colors = useIndicatorColor();

  const ref = useRef<HTMLCanvasElement>(null);

  const drawGauge = useCallback(() => {
    const vw = windowWidth / 100;
    const vh = windowHeight / 100;

    const c = ref.current!.getContext("2d")!;

    c.clearRect(0, 0, windowWidth, windowHeight);

    const blurWidth = vh;
    const width = (20 + (gaugeLevel - 1) * 7) * vw;
    const height = 3 * vh;
    const margin = vh / 2;

    const outerFrameLeftTopX = blurWidth + height;
    const outerFrameUpperY = blurWidth;
    const outerFrameLeftDownX = outerFrameLeftTopX - height;
    const outerFrameLowerY = blurWidth + height;

    const frame = new Path2D();
    frame.moveTo(outerFrameLeftTopX, outerFrameUpperY);
    frame.lineTo(outerFrameLeftTopX + width, outerFrameUpperY);
    frame.lineTo(outerFrameLeftDownX + width, outerFrameLowerY);
    frame.lineTo(outerFrameLeftTopX - height, outerFrameLowerY);
    frame.closePath();

    c.save();
    c.strokeStyle = "white";
    c.lineWidth = blurWidth;

    c.save();
    c.filter = "blur(1.0px)";
    c.stroke(frame);
    c.restore();

    c.fill(frame);
    c.restore();

    const innerFrameLeftTopX = outerFrameLeftTopX + margin;
    const innerFrameUpperY = outerFrameUpperY + margin;
    const innerFrameWidth = width - 4 * margin;
    const innerFrameRightTopX = innerFrameLeftTopX + innerFrameWidth;
    const innerFrameLeftDownX = innerFrameLeftTopX - height + 2 * margin;
    const innerFrameLowerY = outerFrameLowerY - margin;

    c.save();
    const innerFrame = new Path2D();
    innerFrame.moveTo(innerFrameLeftTopX, innerFrameUpperY);
    innerFrame.lineTo(innerFrameRightTopX, innerFrameUpperY);
    innerFrame.lineTo(innerFrameLeftDownX + innerFrameWidth, innerFrameLowerY);
    innerFrame.lineTo(innerFrameLeftDownX, innerFrameLowerY);
    innerFrame.closePath();

    c.clip(innerFrame);

    c.fillStyle = colors[gaugeLevel - 1];
    c.fillRect(0, 0, windowWidth, windowHeight);

    c.fillStyle = colors[gaugeLevel];

    const delta = range.max - range.min;

    // adjust value is in range [minValue, maxValue] whenever.
    const safeValue = value < range.min ? range.min : range.max < value ? range.max : value;
    c.fillRect(
      0,
      0,
      innerFrameLeftDownX +
        (innerFrameRightTopX - innerFrameLeftDownX) * ((safeValue - range.min) / delta),
      windowHeight,
    );

    c.restore();
  }, [windowWidth, windowHeight, colors, gaugeLevel, value, range]);

  useEffect(() => {
    drawGauge();
  }, [drawGauge]);

  return <canvas ref={ref} width={windowWidth} height={(windowHeight / 100) * 5}></canvas>;
}
