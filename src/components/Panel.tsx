import React, { Fragment, memo, useCallback, useState } from "react";
import type { Bans } from "src/types";
import { AddonPanel } from "storybook/internal/components";
import { Button, Placeholder, TabsState } from "storybook/internal/components";
import { useChannel } from "storybook/manager-api";
import { styled, useTheme } from "storybook/theming";

import { EVENTS } from "../constants";
import { List } from "./List";

interface PanelProps {
  active: boolean;
}

export const RequestDataButton = styled(Button)({
  marginTop: "1rem",
});

export const Panel: React.FC<PanelProps> = memo(function Panel(props) {
  const theme = useTheme();

  const [bans, setBans] = useState<Bans>([]);

  const emit = useChannel({
    [EVENTS.RESULT]: (newBans) => {
      setBans(newBans);
    },
  });

  const fetchData = useCallback(() => {
    emit(EVENTS.REQUEST);
  }, [emit]);

  return (
    <AddonPanel {...props}>
      <TabsState
        initial="overview"
        backgroundColor={theme.background.hoverable}
      >
        <div id="overview" title="Overview" color={theme.color.positive}>
          <Placeholder>
            <p>
              This addon scans for elements with a font-size of less than 16px,
              which can be an accessibility concern.
            </p>
            <p>
              Violating elements will be highlighted with a red outline in the
              canvas.
            </p>
            <Fragment>
              <RequestDataButton onClick={fetchData}>Refresh</RequestDataButton>
            </Fragment>
          </Placeholder>
        </div>
        <div
          id="ban"
          title={`${bans.length} Violations`}
          color={theme.color.negative}
        >
          {bans.length > 0 ? (
            <Placeholder>
              <p>The following elements have a font size under 16px:</p>
              <List
                items={bans.map((item) => ({
                  title: `tag: ${item.element.tagName}, fontSize: ${item.fontSize}`,
                  description: item.element.outerHTML,
                }))}
              />
            </Placeholder>
          ) : (
            <Placeholder>
              <p>No elements with a font size under 16px were found.</p>
            </Placeholder>
          )}
        </div>
      </TabsState>
    </AddonPanel>
  );
});
