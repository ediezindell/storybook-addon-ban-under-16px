import { useEffect, useChannel } from "storybook/preview-api";
import type { BanElement, Options, Bans } from "src/types";
import type { DecoratorFunction } from "storybook/internal/types";

import { EVENTS, KEY } from "./constants";

const getSelector = (element: Element) => {
  const { tagName, id, classList } = element;
  let selector = tagName.toLowerCase();
  if (id) {
    selector += `#${id}`;
  }
  if (classList.length > 0) {
    selector += `.${Array.from(classList).join(".")}`;
  }
  return selector;
};

const check = (
  canvas: ParentNode = globalThis.document,
  options: Options,
): Bans => {
  const { targetSelector = "*" } = options;
  const bans = [...canvas.querySelectorAll(targetSelector)]
    .map((element) => {
      const fontSizePx = window.getComputedStyle(element).fontSize;
      const match = fontSizePx.match(/([0-9.]+)px/);
      const fontSize = match?.[1] ? +match[1] : 0;
      const banElement: BanElement = {
        tagName: element.tagName,
        id: element.id,
        className: element.className,
        outerHTML: element.outerHTML,
        selector: getSelector(element),
      };
      return { element: banElement, fontSize };
    })
    .filter(({ fontSize }) => fontSize < 16);

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
