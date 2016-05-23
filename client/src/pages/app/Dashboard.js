import React from 'react'
import auth from '../../util/auth'

const Dashboard = React.createClass({
  render() {
    const user = auth.getUser();
    return (
      <div>
        <br />
        <p>用户信息: {JSON.stringify(user, null, 4)}</p>
        {this.props.children}
      </div>
    )
  }
});

export default Dashboard
