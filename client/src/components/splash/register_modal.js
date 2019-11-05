import React from 'react';
import {Mutation} from 'react-apollo';
import {REGISTER_USER, LOGIN_USER} from '../../graphql/mutations';
import { withRouter, Link } from 'react-router-dom';

import Close from '../../assets/close.svg';

class RegisterModal extends React.Component {
    constructor(props) {
        //comment
        super(props);
        this.state = {email: "", password: "", name: "", _id: ""};
    }

    update(field) {
        return (e) => this.setState({
            [field]: e.target.value
        })
    }

    updateCache(client, { data }) {
        client.writeData({
            data: { isLoggedIn: data.register.loggedIn }
        });
    }

    render() {
        return(
            <Mutation mutation={REGISTER_USER}
                onCompleted={data => {
                    const {token} = data.register;
                    localStorage.setItem("auth-token", token);
                    this.props.history.push("/chooseCourse");
                }}
                update={(client, data) => this.updateCache(client, data)}
                refetchQueries={(data) => {
                    console.log("refetchQueries", data);
                    console.log(data.data.register.name);
                    this.setState({name: data.data.register.name, _id: data.data.register._id})
                }}
            >
                {registerUser => (
                    <div className="authModal">
                        <div className="closeButton">
                            <img src={Close} alt="close button" onClick={this.props.toggleRegisterModal}/>
                        </div>
                        <h3>Sign up</h3>
                        <form className="authInputForm"
                            onSubmit={e => {
                                e.preventDefault();
                                registerUser({
                                    variables: {
                                        name: this.state.name,
                                        email: this.state.email,
                                        password: this.state.password
                                    }
                                });
                            }}
                        >
                            <div className="authInputContainer">
                                <input className="authInput" type="text" placeholder="Username"
                                    value={this.state.name} onChange={this.update("name")} />
                                <input className="authInput" type="text" placeholder="Email"
                                    value={this.state.email} onChange={this.update("email")} />
                                <input className="authInput" type="password" placeholder="Password"
                                    value={this.state.password} onChange={this.update("password")} />
                            </div>
                            <button className="authButton" type="submit">Sign up</button>
                        </form>
                        <button className="authButton"                         
                            onClick={e => {
                                e.preventDefault();
                                registerUser({
                                    variables: {
                                        name: (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)),
                                        email: (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)) + "@email.com",
                                        password: 'password'
                                    }
                                });
                            }}>Demo Login</button>
        
                        <div className="disclaimer">
                            <h5>By signing in to Codolingo, you agree to our Terms and Privacy Policy</h5>
                            <div className="switchAuth">
                                <h5>Already have an account?</h5>
                                <button className="switchAuthButton" onClick={this.props.toggleBothModals}>Log in</button>
                            </div>
                        </div>
                    </div>
                )}
            </Mutation>
        )
    }
}

export const registerUser = RegisterModal.state;

export default withRouter(RegisterModal);