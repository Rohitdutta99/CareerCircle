import styled from "styled-components";
import { connect } from "react-redux";
import { signInAPI } from "../actions";
import { Navigate } from "react-router-dom";



const Login = (props) => {
    return (
        <Container>
            {props.user && <Navigate to="/home" />}
            <Nav>
                <a href="/">
                    <img src="/images/3.svg" alt="" />
                </a>
                <div>
                    <Join>Join now</Join>
                    <SignIn onClick={() => props.signIn()}>Log in</SignIn>
                </div>
            </Nav>
            <Section>
                <Hero>
                    <h1>Welcome to your professional community</h1>
                    <img src="/images/login-hero.svg" alt="login page graphics" />
                </Hero>
                <Form>
                    <Google onClick={() => props.signIn()}>
                        <img src="/images/google.svg" alt="google logo" />
                        Sign in with Google
                    </Google>
                </Form>
            </Section>
        </Container>
    );
}

const Container = styled.div`
padding: 0;

`;
const Nav = styled.nav`
max-width: 1300px;
margin: auto;
padding: 12px 0 16px;
display: flex;
align-items: center;
position: relative;
justify-content: space-between;
flex-wrap: nowrap;

& > a{
    width: 135px;
    height: 34px;
    @media (max-width: 768px){
        padding: 0 5px;
    }
}

img{
    height: 200px;
    position: relative;
    bottom: 70px;
    mix-blend-mode: multiply;

}
`;

const Join = styled.a`
font-size: 16px;
padding: 10px 12px;
text-decoration: none;
color: rgba(0, 0, 0, 0.6);
margin-right: 12px;

&:hover{
    background-color: rgba(0, 0, 0, 0.08);
    color: rgba(0, 0, 0, 0.9);
    text-decoration: none;
    border-radius: 4px;
    cursor: pointer;
}
`;

const SignIn = styled.a`
box-shadow: inset 0 0 0 1px #004AAD;
color: #004AAD;
border-radius: 24px;
transition-duration: 167ms;
font-size: 16px;
font-weight: 600;
line-height: 40px;
padding: 10px 24px; 
background-color: rgba(0, 0, 0, 0);

&:hover{
    background-color: rgba(112, 181, 249, 0.15);
    cursor: pointer;
    color: #0a66c2;
    text-decoration: none;
}
`;

const Section = styled.section`
display: flex;
align-content: start;
min-height: 50vh;
padding-bottom: 138px;
padding-top: 40px;
padding: 60px 0;
position: relative;
flex-wrap: wrap;
width: 100%;
max-width: 1300px;
align-items: center;
margin: auto;

@media(max-height: 768px){
    margin: auto;
    min-height: 0px;
}


`;



const Hero = styled.div`
width: 100%;
h1{
    padding-bottom: 0;
    width: 55%;
    font-size: 56px;
    color: #004AAD;
    font-weight: 200;
    line-height: 75px;
    padding-top: 70px;
    
    @media(max-width: 768px){
        text-align: center;
        font-size: 20px;
        width: 100%;
        line-height: 2;
    }
}

    img{
        width: 700px;
        height: 700px;
        position: absolute;
        top: 2px;
        right: -150px;
        
        @media(max-width: 768px){
            top: 230px;
            width: initial;
            position: initial;
            height: initial;
        }
    }
    `;

const Form = styled.div`
    margin-top: 100px;
    width: 408px;
    padding: 10px;
    
    @media(max-width: 768px){
        margin-top: 20px;
        justify-content: center;
        align-items: center;
        width: 50%;
        position: relative;
        left: 22.5vw;
    }
    
    `;
const Google = styled.button`
    display: flex;
    justify-content: center;
    background-color: #fff;
    align-items: center;
    height: 56px;
    width: 100%;
    border-radius: 28px;
    box-shadow: inset 0 0 0 rgb(0 0 0 / 60%), inset 0 0 0 2px rgb(0 0 0 / 0%) inset 0 0 0 1px rgb(0 0 0 / 0%);
    vertical-align: middle;
    z-index: 0;
    transition-duration: 167ms;
    font-size: 20px;
    color: rgba(0 0 0 0.6);
    
    &:hover{
        background-color: rgba(207, 207, 207, 0.25);
        color: rgba(0 0 0 0.75);
        cursor: pointer;
    }
`;


const mapStateToProps = (state) => {
    return {
        user: state.userState.user,
    };
};

const mapDispatchToProps = (dispatch) => ({
    signIn: () => dispatch(signInAPI()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);