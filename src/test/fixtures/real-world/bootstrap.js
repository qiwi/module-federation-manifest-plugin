import { render } from 'react-dom'
import { createElement } from 'react'
import { Button } from 'ui-kit'
import remoteApp from 'remote1/app'

remoteApp()
render(createElement(Button()))
