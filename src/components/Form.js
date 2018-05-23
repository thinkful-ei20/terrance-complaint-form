import React, { Component } from 'react';
import '../styles/Form.css';
import { reduxForm, Field, SubmissionError, focus } from 'redux-form';
import { required, isNum, checkEmpty, checkLength } from '../validators';
import Input from './Input';

class Form extends Component {

  onSubmit(values) {
    console.log(values);
    return fetch('https://us-central1-delivery-form-api.cloudfunctions.net/api/report', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
          'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) {
          if (
              res.headers.has('content-type') &&
              res.headers
                  .get('content-type')
                  .startsWith('application/json')
          ) {
              // It's a nice JSON error returned by us, so decode it
              return res.json().then(err => Promise.reject(err));
          }
          // It's a less informative error returned by express
          return Promise.reject({
              code: res.status,
              message: res.statusText
          });
      }
      return;
    })
    .then(() => console.log('Submitted with values', values))
    .catch(err => {
      const {reason, message, location} = err;
      if (reason === 'ValidationError') {
        // Convert ValidationErrors into SubmissionErrors for Redux Form
        return Promise.reject(
            new SubmissionError({
                [location]: message
            })
        );
      }
      return Promise.reject(
        new SubmissionError({
            _error: 'Error submitting message'
        })
      );
    });
  }

  render() {
    let successMessage;
    if (this.props.submitSucceeded) {
        successMessage = (
            <div className="message message-success">
                Message submitted successfully
            </div>
        );
    }

    let errorMessage;
    if (this.props.error) {
        errorMessage = (
            <div className="message message-error">{this.props.error}</div>
        );
    }

    let reason = ['not-delivered', 'wrong-item', 'missing-part', 'damaged', 'other'];

    return (
      <form onSubmit={(this.props.handleSubmit(values => this.onSubmit(values)))}>
        {successMessage}
        {errorMessage}
        <h2>Report a problem with your delivery</h2>
        <Field
          label="Tracking number"
          validate={[required, isNum, checkEmpty, checkLength]}
          component={Input}
          id="trackingNumber"
          name="trackingNumber"
          type="type" />
        <Field
          element="select"
          label="What is your issue?"
          component={Input}
          name="issue"
          id="issue">
          <option value={reason[0]}>My delivery hasn't arrived</option>
          <option value={reason[1]}>The wrong item was delivered</option>
          <option value={reason[2]}>Part of my order was missing</option>
          <option value={reason[3]}>Some of my order arrived damaged</option>
          <option value={reason[4]}>Other (give details below)</option>
        </Field>
        <Field
          value="textarea"
          element="textarea"
          label="Give more details (optional)"
          component={Input}
          id="details"
          name="details">
        </Field>
        <button type="submit">Submit</button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'complaintForm',
  onSubmitFail: (errors, dispatch) =>
        dispatch(focus('contact', Object.keys(errors)[0]))
})(Form);

