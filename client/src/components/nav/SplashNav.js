import React from 'react';
import {Link, withRouter} from 'react-router-dom';

import Menu from '../../assets/hamburger-menu.svg';
import Logo from '../assets/codolingo-logo2.png';

// import { Query, ApolloConsumer } from "react-apollo";
// import Queries from "../../graphql/queries";
// const { IS_LOGGED_IN } = Queries;

class SplashNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {dropdown: false};
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        const body = document.getElementsByTagName("body")[0];
        body.addEventListener("click", (event) => {
            if(this.state.dropdown) {
                if(!Array.from(event.target.classList).includes("headerDropdown")
                && !Array.from(event.target.classList).includes("dropdownItem")
                && !Array.from(event.target.classList).includes("dropdownButton")) {
                    if(this.state.dropdown) {
                        this.setState({dropdown: false})
                    }
                }
            }
        })
    }

    handleClick() {
        this.setState({
            dropdown: true
        })
    }

    render() {
        return(
            <div className="splashNav">
                <a href="#"><img className="logo" src={Logo} alt="logo" /></a>
                <div className="dropdownButton" onClick={this.handleClick}>
                    <img className="headerMenu" src={Menu} alt="hamburger menu" />
                    {this.state.dropdown && 
                        <div className="headerDropdown">
                            <div className="dropdownTriangle"></div>
                            <ul className="dropdownList">
                                <li className="dropdownItem">
                                    <button className="dropdownButton" onClick={this.props.toggleRegisterModal}>Get started</button>
                                </li>
                                <li className="dropdownItem">
                                    <button className="dropdownButton" onClick={this.props.toggleLoginModal}>Sign in</button>
                                </li>
                                <li className="dropdownItem">Site language: English</li>
                            </ul>
                        </div>}
                </div>
                
            </div>
        )
    }
}

export default SplashNav;

