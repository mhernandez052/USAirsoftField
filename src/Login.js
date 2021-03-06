import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import logo from './assets/logo.png';

import { withFirebase } from './components/Firebase';
import { PasswordForgetLink } from './passwordForgot';
import ReCAPTCHA from 'react-google-recaptcha';
import { Container, Row, Col, Form, Button } from 'react-bootstrap/';

//import { SignUpLink } from './components/Pages/Signup';
//    <SignUpLink /> 

const SignInPage = () => (
  <div className="background-static-all">
    <Container className="login-container">
      <Col className="login-col">
        <Row className="header-rp">
          <img src={logo} alt="US Airsoft logo" className="small-logo-login"/>
        </Row>
        <SignInForm />
      </Col>
    </Container>
  </div>
);


const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
  robot: true
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.handleCaptchaResponseChange = this.handleCaptchaResponseChange.bind(this);
    this.state = { ...INITIAL_STATE };
  }

  //Recaptcha stuff
  handleCaptchaResponseChange(response) {
    console.log(response)
    this.setState({
      robot: false,
    });
  }

  onSubmit = event => {
    const { email, password } = this.state;
    this.recaptcha.reset();

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push("/");
      })
      .catch(error_p => {
        this.setState({ error: "The Email or Password is incorrect" });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error, robot } = this.state;

    const isInvalid = password === '' || email === '' || robot === true;

    return (
      <div>
        <Form className="login-form" onSubmit={this.onSubmit}>
          <Form.Group>
            <Form.Label className="form-label-login">Email:</Form.Label>
            <Form.Control
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              placeholder="Email Address"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="form-label-login">Password:</Form.Label>
            <Form.Control
              name="password"
              value={password}
              onChange={this.onChange}
              type="password"
              placeholder="Enter Password"
            />
          </Form.Group>
          <Button disabled={isInvalid} type="submit" block>
            Sign In
        </Button>
        <PasswordForgetLink />
          {error && <p>{error.message}</p>}
          <p>{this.state.error}</p>
        </Form>
        <Container>
          <Row className="align-items-center col-md-auto justify-content-center">
            <Col className="recap">
              <ReCAPTCHA
                ref={(el) => { this.recaptcha = el; }}
                sitekey="6Lc0JPsUAAAAAGfLV1lzptnyO2V1dTU7GfR5_5h5"
                onChange={this.handleCaptchaResponseChange} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };