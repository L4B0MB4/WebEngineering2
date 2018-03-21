import React, {Component} from "react";
import {Menu} from "semantic-ui-react"

export default class Header extends Component
{
    render()
    {
        return (
            <Menu fluid widths={1} size='massive' className='header'>
          <Menu.Item>
            GOLDdigger.io
          </Menu.Item>
        </Menu>
        )
    }
}