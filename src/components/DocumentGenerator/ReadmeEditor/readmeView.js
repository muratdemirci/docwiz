import React, { Component } from 'react'
import RequestList from './readmeCreate'

class RequestView extends Component {
  state = {
    requestDetails: [
      {
        index: Math.random(),
        name: '',
        lorem: '',
        type: '',
        dateOfPublish: '',
        price: '',
      },
    ],
  }
  handleChange = (e) => {
    if (
      ['name', 'lorem', 'type', 'dateOfPublish', 'price'].includes(
        e.target.name
      )
    ) {
      let requestDetails = [...this.state.requestDetails]
      requestDetails[e.target.dataset.id][e.target.name] = e.target.value
    } else {
      this.setState({ [e.target.name]: e.target.value })
    }
  }
  addNewRow = (e) => {
    this.setState((prevState) => ({
      requestDetails: [
        ...prevState.requestDetails,
        {
          index: Math.random(),
          name: '',
          lorem: '',
          type: '',
          dateOfPublish: '',
          price: '',
        },
      ],
    }))
  }

  deteteRow = (index) => {
    this.setState({
      requestDetails: this.state.requestDetails.filter(
        (s, sindex) => index !== sindex
      ),
    })
  }

  clickOnDelete(record) {
    this.setState({
      requestDetails: this.state.requestDetails.filter((r) => r !== record),
    })
  }
  render() {
    let { requestDetails } = this.state
    return (
      <div className="content">
        <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
          <div className="row" style={{ marginTop: 20 }}>
            <div className="col-sm-1" />
            <div className="col-sm-10">
              <div className="container">
                <div className="row">
                  <RequestList
                    add={this.addNewRow}
                    delete={this.clickOnDelete.bind(this)}
                    requestDetails={requestDetails}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-1" />
          </div>
        </form>
      </div>
    )
  }
}
export default RequestView
