import React, { memo, useState, useEffect } from "react";
import type { Bans } from "src/types";
import { AddonPanel } from "storybook/internal/components";
import { Placeholder } from "storybook/internal/components";
import { useChannel } from "storybook/manager-api";

import { EVENTS } from "../constants";
import { List } from "./List";

interface PanelProps {
  active: boolean;
}

export const Panel: React.FC<PanelProps> = memo(function MyPanel(props) {
  const [bans, setBans] = useState<Bans>([]);

  const emit = useChannel({
    [EVENTS.RESULT]: (newBans) => {
      setBans(newBans);
    },
  });

  useEffect(() => {
    emit(EVENTS.REQUEST);
  }, [emit]);

  return (
    <AddonPanel {...props}>
      {bans.length > 0 ? (
        <>
          <p style={{ padding: "10px", margin: 0 }}>
            The following elements has under 16px font size.
          </p>
          <List
            items={bans.map((item) => ({
              title: item.element.selector,
              description: `Font size: ${item.fontSize}px\n\n${item.element.outerHTML}`,
            }))}
          />
        </>
      ) : (
        <Placeholder>
          <p>No bans found</p>
        </Placeholder>
      )}
    </AddonPanel>
  );
});
