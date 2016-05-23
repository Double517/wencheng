import React from 'react'
import auth from '../../util/auth'

const Logout = React.createClass({
  componentDidMount() {
    auth.logout()
  },

  render() {
    return <p>登出成功</p>
  }
});

export default Logout
