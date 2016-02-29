import 'babel-polyfill'
import 'style'

/*----------------------------------------------------------------------------*/

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

/*----------------------------------------------------------------------------*/

import React from 'react'
import { render } from 'react-dom'
import Routes from './Routes'

/*----------------------------------------------------------------------------*/

render(Routes, document.getElementById(`root`))
