import 'babel-polyfill'
import 'style'

/*----------------------------------------------------------------------------*/

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

/*----------------------------------------------------------------------------*/

import React from 'react'
import { render } from 'react-dom'
import routes from './routes'

/*----------------------------------------------------------------------------*/

render(routes, document.getElementById(`app`))
