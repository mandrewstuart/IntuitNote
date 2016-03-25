import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { App } from '../App'

describe('<App />', () => {
  it('should exist', () => {
    let component = shallow(<App />)
    expect(component).to.exist
  })
})
