'use strict';

import React from 'react';
import { createDevTools, persistState } from 'redux-devtools';
import Dispatch from 'redux-devtools-dispatch';
import LogMonitor from 'redux-devtools-log-monitor';
import MultipleMonitors from 'redux-devtools-multiple-monitors';
import DockMonitor from 'redux-devtools-dock-monitor';

export default createDevTools(
  <DockMonitor toggleVisibilityKey='ctrl-h'
    changePositionKey='ctrl-q'
    defaultIsVisible={false}>
    <MultipleMonitors>
      <LogMonitor theme='tomorrow' />
      <Dispatch />
    </MultipleMonitors>
  </DockMonitor>
);
