import { useState, useEffect } from "react";
import styled from "styled-components";
import PostModal from "./PostModal";
import { connect } from "react-redux";
// import { getArticlesAPI } from "../actions";
// import { getData } from './PostModal';

// Now you can use getData wherever you need it in Main.js

const Main = (props) => {
  const [showModal, setShowModal] = useState("close");
  
  // useEffect(() => {
  //   props.getArticles();
  // }, []);
  const handleClick = (e) => {
    e.preventDefault();

    switch (showModal) {
      case "open":
        setShowModal("close"); // Close the modal if it's open
        break;
      case "close":
        setShowModal("open"); // Open the modal if it's closed
        break;
      default:
        setShowModal("close");
        break;
    }
  };




  return <Container>
    <ShareBox>
      <div>
        {props.user && props.user.photoURL ? (
          <img src={props.user.photoURL} />)
          :
          (<img src="images/user.svg" alt="user-logo" />)
        }
        <button onClick={handleClick} disabled={props.loading ? true : false}>Start a post</button>
      </div>
      <div>
        <button>
          <img src="/images/photo.svg" alt="user-logo" />
          <span>Photo</span>
        </button>

        <button>
          <img src="/images/video.svg" alt="event-icon" />
          <span>Video</span>
        </button>

        <button>
          <img src="/images/events.svg" alt="event-icon" />
          <span>Event</span>
        </button>

        <button>
          <img src="/images/write.svg" alt="write-icon" />
          <span>Write Article</span>
        </button>
      </div>
    </ShareBox>
    <Content>
      {props.loading && <img src="/images/gear-spinner.svg" />}
      {/* {
        getData.data.map(value =>  */}

          
      {/* )
  } */}
    </Content>

    <PostModal showModal={showModal} handleClick={handleClick} />
  </Container>;
};

const Container = styled.div`
  grid-area: main;
  button, a{
    cursor: pointer;
  }
`;

const CommonCard = styled.div`
  text-align: center;
  overflow: center;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 /15%), 0 0 0 rgb(0 0 0/ 20%);

`;

const ShareBox = styled(CommonCard)`
  display: flex;
  flex-direction: column;
  color: #958b7b;
  margin: 0 0 8px;
  background-color: white;
  div{
    button{
      outline: none;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      line-height: 1.5;
      min-height: 48px;
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      font-weight: 600;
      img{
        height: 25px;
      }
    }

    &:first-child{
      display: flex;
      align-items: center;
      padding: 8px 16px 0px 16px;
      img{
        width: 48px;
        border-radius: 50%;
        margin-right: 8px;
      }

      button{
        margin 4px 0;
        flex-grow: 1;
        border-radius: 35px;
        padding-left: 16px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        background-color: white;
        text-align: left;

      } 
    }
    &:nth-child(2){
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      padding-bottom: 4px;
      
      button{
        img{
          margin: 0 4px 0 -2px;
        }
        span{
          color: #70b5f9;
        }
      }
    }
  }
`;

const Article = styled(CommonCard)`
  padding: 0;
  margin: 0 0 8px;
  overflow: visible;
  overflow: hidden;

  
`;


const SharedActor = styled.div`
padding-right: 4px;
  flex-wrap: nowrap;
  padding: 12px 16px 0;
  margin-bottom: 8px;
  align-items: center;
  display: flex;

  a{
    margin-right: 12px;
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    text-decoration: none;
  }

  img{
    width: 48px;
    height: 48px;
  }

  &>div{
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    flex-basis: 0;
    margin-left: 8px;
    overflow: hidden;
  }

  span{
    text-align: left;
    &:first-child{
      font-size: 14px;
      font-weight: 700;
      color: (0, 0, 0, 1);
    }

    &:nth-Child(n+1){
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);

    }
  }
  button > img{
    height:20px;
  }
  button{
    position: absolute;
    right: 12px;
    top: 0;
    background: transparent;
    border: none;
    outline: none;
  }
`;

const Description = styled.div`
  padding: 0 16px;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.9);
  font-size: 14px;
  text-align: left;

`;
const SharedImg = styled.div`
  
  width: 100%;
  display: block;
  position: relative;
  background-color: #f9fafb;
  border-radius: 10px;
  overflow: hidden;
  
  img{
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
`;

const SocialCounts = styled.ul`
  line-height: 1.3;
  display: flex;
  align-items: flex-start;
  overflow: auto;
  margin: 0 16px;
  padding: 8px 0;
  border-bottom: 1px solid #e9e5df;
  list-style: none;

  li{
    margin-right: 5px;
    font-size: 12px;

    button{
      display: flex;
    }
  }


`;

const SocialActions = styled.div`

align-items: center;
display: flex;
justify-content: flex-start;
margin: 0;
min-height: 40px;
padding: 4px 8px;
button > img{
  height: 15px;
}

button{
  displayL inline-flex;
  align-items: center;
  padding: 5px 15px;
  color: #0a66c2;

  @media(min-width: 768px){
    span{
      margin-left: 8px;
      
    }
  }
}
`;

const Content = styled.div`
  text-align: center;
  & > img{
    width: 30px;

  }
`;

const mapStateToProps = (state) => {
  return{
  loading: state.articleState.loading,
  user: state.userState.user,
  }
}


export default connect(mapStateToProps)(Main);