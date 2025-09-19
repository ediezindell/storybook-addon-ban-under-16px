import { useEffect, useChannel } from "storybook/preview-api";
import type { Options, Bans } from "src/types";
import type { DecoratorFunction } from "storybook/internal/types";

import { EVENTS, KEY } from "./constants";

const check = (
  canvas: ParentNode = globalThis.document,
  options: Options,
): Bans => {
  const { targetSelector = "input, textarea" } = options;
  const bans = [...canvas.querySelectorAll(targetSelector)]
    .map((element) => {
      const fontSizePx = window.getComputedStyle(element).fontSize;
      const match = fontSizePx.match(/([0-9.]+)px/);
      const fontSize = match?.[1] ? +match[1] : 0;
      return { element, fontSize };
    })
    .filter(({ fontSize }) => fontSize < 16);
  console.log(bans);

  return bans;
};

export const withBan: DecoratorFunction = (storyFn, context) => {
  const options = context.globals[KEY] || {};
  const { enabled } = options;

  const canvasElement = context.canvasElement as ParentNode;
  const emit = useChannel({
    [EVENTS.REQUEST]: () => {
      emit(EVENTS.RESULT, check(canvasElement, options));
    },
  });
  useEffect(() => {
    if (!enabled) return; // TODO: targetSelectorでのチェック
    emit(EVENTS.RESULT, check(canvasElement, options));
  });

  return storyFn();
};
