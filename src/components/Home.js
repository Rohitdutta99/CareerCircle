import styled from "styled-components";
import Header from "./Header";
import LeftSide from "./LeftSide";
import Main from "./Main";
import RightSide from "./RightSide";
import {connect} from "react-redux";
import { Navigate } from "react-router";

const Home = (props) => {
    return (
        <Container>
          {!props.user && <Navigate to="/"/>}
            <Header />
            <Section>
                <h5>
                    <a>Hiring in a hurry? - </a>
                </h5>
                <p>
                    Find talented pros in record time with Upwork and keep business
                    moving.
                </p>
            </Section>
            <Layout>
              <LeftSide></LeftSide>
              <Main></Main>
              <RightSide></RightSide>
            </Layout>

        </Container>
    );
};

const Container = styled.div`
  margin-top: 52px;
  max-width: 100%;
`;

const Content = styled.div`
  max-width: 1128px;
  margin-left: auto;
  margin-right: auto;
`;

const Section = styled.section`
  min-height: 50px;
  padding: 16px 0;
  box-sizing: content-box;
  text-align: center;
  text-decoration: underline;
  display: flex;
  justify-content: center;
  h5 {
    color: #0a66c2;
    font-size: 14px;
    a {
      font-weight: 700;
    }
  }

  p {
    font-size: 14px;
    color: #434649;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0 5px;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-areas: "leftside main rightside";
  grid-template-columns: minmax(0, 5fr) minmax(0, 12fr) minmax(300px, 7fr);
  column-gap: 50px;
  row-gap: 25px;
  width: 95%;
  /* grid-template-row: auto; */
  margin: 25px 10px;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding: 0 5px;
  }
`;

const mapStateToProps = (state) =>{
  return {
    user: state.userState.user,
  };
};

export default connect(mapStateToProps)(Home);