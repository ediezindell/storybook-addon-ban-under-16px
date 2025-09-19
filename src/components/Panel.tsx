import React, { Fragment, memo, useCallback, useState } from "react";
import type { Result } from "src/types";
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

export const Panel: React.FC<PanelProps> = memo(function MyPanel(props) {
  const theme = useTheme();

  // https://storybook.js.org/docs/react/addons/addons-api#useaddonstate
  const [{ bans }, setState] = useState<Result>({
    bans: [],
  });

  // https://storybook.js.org/docs/react/addons/addons-api#usechannel
  const emit = useChannel({
    [EVENTS.RESULT]: (newResults) => {
      setState(newResults);
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
            <Fragment>
              Addons can gather details about how a story is rendered. This is
              panel uses a tab pattern. Click the button below to fetch data for
              the other two tabs.
            </Fragment>
            <Fragment>
              <RequestDataButton onClick={fetchData}>
                Request data
              </RequestDataButton>
            </Fragment>
          </Placeholder>
        </div>
        <div
          id="ban"
          title={`${bans.length} bans`}
          color={theme.color.negative}
        >
          {bans.length > 0 ? (
            <Placeholder>
              <p>The following bans have less than 2 childNodes</p>
              <List
                items={bans.map((item, index) => ({
                  title: `item #${index}`,
                  description: JSON.stringify(item, null, 2),
                }))}
              />
            </Placeholder>
          ) : (
            <Placeholder>
              <p>No bans found</p>
            </Placeholder>
          )}
        </div>
      </TabsState>
    </AddonPanel>
  );
});
