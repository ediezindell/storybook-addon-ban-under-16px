import { useEffect, useChannel } from "storybook/preview-api";
import type { Options, Bans } from "src/types";
import type { DecoratorFunction } from "storybook/internal/types";

import { EVENTS, KEY } from "./constants";

const check = (
  canvas: ParentNode = globalThis.document,
  options: Options,
): Bans => {
  const { targetSelector = "input, textarea" } = options;
  const bans = [...canvas.querySelectorAll(targetSelector)].filter(
    (element) => {
      const { fontSize } = window.getComputedStyle(element);
      const match = fontSize.match(/([0-9.]+)px/);
      if (!match) return false;
      const size = +match[1]!;
      return size < 16;
    },
  );
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
