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

  return bans;
};

export const withBan: DecoratorFunction = (storyFn, context) => {
  const options = context.globals[KEY] || {};
  const { enabled } = options;
  const { targetSelector = "input, textarea" } = options;

  const canvasElement = context.canvasElement as ParentNode;

  const runCheck = () => {
    // Always clear existing highlights before running a new check
    const allElements = [...canvasElement.querySelectorAll(targetSelector)];
    allElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.outline = "";
      }
    });

    if (enabled) {
      const bans = check(canvasElement, options);
      bans.forEach(({ element }) => {
        if (element instanceof HTMLElement) {
          element.style.outline = "2px solid red";
        }
      });
      emit(EVENTS.RESULT, bans);
    } else {
      // If disabled, ensure panel is empty
      emit(EVENTS.RESULT, []);
    }
  };

  const emit = useChannel({
    [EVENTS.REQUEST]: runCheck,
  });

  useEffect(() => {
    runCheck();
  }, [enabled, context.storyId]);

  return storyFn();
};
