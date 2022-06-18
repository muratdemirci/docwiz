import React, { Component } from 'react'
import Navitem from './NavItem'

class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      NavItemActive: '',
    }
  }
  activeitem = (x) => {
    if (this.state.NavItemActive.length > 0) {
      document
        .getElementById(this.state.NavItemActive)
        .classList.remove('active')
    }
    this.setState({ NavItemActive: x }, () => {
      document.getElementById(this.state.NavItemActive).classList.add('active')
    })
  }
  render() {
    return (
      <nav>
        <ul>
          <Navitem
            item="Nasıl Çalışır?"
            tolink="/"
            activec={this.activeitem}
          ></Navitem>
          <Navitem
            item="Hızlı Başlangıç"
            tolink="/quick-start"
            activec={this.activeitem}
          ></Navitem>
        </ul>
      </nav>
    )
  }
}

export default Navbar
