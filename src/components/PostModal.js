import { useEffect, useState } from "react";
import styled from "styled-components";
import ReactPlayer from "react-player";
import { connect } from "react-redux";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getDocs, getDoc, doc, updateDoc, addDoc, collection, deleteDoc, Timestamp, runTransaction} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { imageDb, txtDb } from "../firebase"; 


const PostModal = (props) => {
    const [editorText, setEditorText] = useState("");
    const [shareImage, setShareImage] = useState("");
    const [videoLink, setVideoLink] = useState("");
    const [assetArea, setAssetArea] = useState("");
    const [data, setData] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState("");
    const handleChange = (e) => {
        const image = e.target.files[0];

        if (image === "" || image === undefined) {
            alert(`Not an image, the file is a ${typeof image}`);
            return;
        }
        setShareImage(image);
    };

    const switchAssetArea = (area) => {
        setShareImage("");
        setVideoLink("");
        setAssetArea(area);
    };

    const postArticle = async (e) => {
        e.preventDefault();

        if (shareImage !== "") {
            const imgRef = ref(imageDb, `files/${uuidv4()}`);
            try {
                const snapshot = await uploadBytes(imgRef, shareImage);
                const downloadURL = await getDownloadURL(snapshot.ref);

                const valRef = collection(txtDb, 'txtData');
                await addDoc(valRef, {
                    txtVal: editorText,
                    imgUrl: downloadURL,
                    username: props.user.displayName,
                    userimg: props.user.photoURL,
                    useremail: props.user.email,
                    time: Timestamp.now(),
                    likestate: false,
                    videoLink: ""
                });
                reset(e);
                setReloadTrigger(!reloadTrigger);
            } catch (error) {
                console.error("Error uploading image or adding document: ", error);
            }
        } else {
            const valRef = collection(txtDb, 'txtData');
            await addDoc(valRef, {
                txtVal: editorText,
                imgUrl: "",
                username: props.user.displayName,
                userimg: props.user.photoURL,
                useremail: props.user.email,
                time: Timestamp.now(),
                likestate: false,
                videoLink: videoLink
            });
            reset(e);
            setReloadTrigger(!reloadTrigger);
        }
    };

    const getData = async () => {
        const valRef = collection(txtDb, 'txtData');
        const dataDb = await getDocs(valRef);
        const allData = dataDb.docs.map((val) => ({ ...val.data(), id: val.id }));
        setData(allData);

        const commentsData = {};
        allData.forEach((post) => {
            commentsData[post.id] = post.comments || [];
        });
        setComments(commentsData);
    };

    const handleLike = async (value) => {
        const postRef = doc(txtDb, 'txtData', value.id);
    
        try {
            await runTransaction(txtDb, async (transaction) => {
                const postDoc = await transaction.get(postRef);
                if (!postDoc.exists()) {
                    throw "Document does not exist!";
                }
    
                const postData = postDoc.data();
                const currentLikes = postData.likes || 0;
                const likedBy = Array.isArray(postData.likedBy) ? postData.likedBy : [];
    
                
                if (!likedBy.includes(props.user.uid)) {
                    transaction.update(postRef, {
                        likes: currentLikes + 1,
                        likedBy: [...likedBy, props.user.uid]
                    });
                }
            });
    
            setReloadTrigger(!reloadTrigger);
        } catch (error) {
            console.error("Error handling like:", error);
        }
    };
    

    const formatDate = (timestamp) => {
        if (timestamp) {
            const date = timestamp.toDate();
            return date.toLocaleString();
        }
        return "";
    };
    
    const handleComment = async (id) => {
        const postRef = doc(txtDb, 'txtData', id);
        const postDoc = await getDoc(postRef);
        const currentComments = postDoc.data().comments || [];
        const updatedComments = [...currentComments, { text: newComment, user: props.user.displayName }];
        await updateDoc(postRef, { comments: updatedComments });

        setComments((prevComments) => ({
            ...prevComments,
            [id]: updatedComments
        }));

        setNewComment("");
        setReloadTrigger(!reloadTrigger);
    };

    const handleDelete = async (id, email) => {
        const postRef = doc(txtDb, 'txtData', id);
        if (props.user.email == email){
            await deleteDoc(postRef);
        }
        setReloadTrigger(!reloadTrigger);
    };

    useEffect(() => {
        getData();
    }, [reloadTrigger]);

    const reset = (e) => {
        setEditorText("");
        setShareImage("");
        setVideoLink("");
        setAssetArea("");
        props.handleClick(e); // This will handle closing the modal
    };

    

    return (
        <>
            {props.showModal === "open" && (
                <Container>
                    <Content>
                        <Header>
                            <h2>Create a post</h2>
                            <button onClick={(event) => reset(event)}>
                                <img src="/images/close.svg" alt="Close" />
                            </button>
                        </Header>
                        <SharedContent>
                            <UserInfo>
                                {props.user.photoURL ? (
                                    <img src={props.user.photoURL} alt="User" />
                                ) : (
                                    <img src="/images/user.svg" alt="User" />
                                )}
                                <span>{props.user.displayName}</span>
                            </UserInfo>
                            <Editor>
                                <textarea
                                    value={editorText}
                                    onChange={(e) => setEditorText(e.target.value)}
                                    placeholder="What do you want to talk about?"
                                    autoFocus={true}
                                />
                                {assetArea === "image" ? (
                                    <UploadImage>
                                        <input
                                            type="file"
                                            accept="image/gif, image/jpeg, image/png"
                                            name="image"
                                            id="file"
                                            style={{ display: "none" }}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <p>
                                            <label htmlFor="file">Select an image to share</label>
                                        </p>
                                        {shareImage && (
                                            <img src={URL.createObjectURL(shareImage)} alt="Preview" />
                                        )}
                                    </UploadImage>
                                ) : (
                                    assetArea === "media" && (
                                        <>
                                            <input
                                                type="text"
                                                placeholder="Please input a video link"
                                                value={videoLink}
                                                onChange={(e) => setVideoLink(e.target.value)}
                                            />
                                            {videoLink && <ReactPlayer width={"100%"} url={videoLink} />}
                                        </>
                                    )
                                )}
                            </Editor>
                        </SharedContent>
                        <SharedCreation>
                            <AttachAssets>
                                <AssetButton onClick={() => switchAssetArea("image")}>
                                    <img src="images/shared-image-icon.svg" alt="Image" />
                                </AssetButton>
                                <AssetButton onClick={() => switchAssetArea("media")}>
                                    <img id="video-button" src="images/shared-video-icon.svg" alt="Video" />
                                </AssetButton>
                            </AttachAssets>
                            <ShareComment>
                                <AssetButton>
                                    <img id="video-button" src="images/chat.svg" alt="Chat" />
                                    Anyone
                                </AssetButton>
                            </ShareComment>
                            <PostButton
                                disabled={!editorText}
                                onClick={(event) => postArticle(event)}
                            >
                                Post
                            </PostButton>
                        </SharedCreation>
                    </Content>
                </Container>
            )}
            {data.map((value) => (
                <Article key={value.id}>
                    <SharedActor>
                        <a>
                            <img src={value.userimg} alt="user-icon" />
                            <div>
                                <span>{value.username}</span>
                                
                                <span id="time-on-post">{formatDate(value.time)}</span>
                            </div>
                        </a>
                        <button  onClick={() => handleDelete(value.id, value.useremail)}>
                            <img id="del-img" src="/images/icons8-bin.gif" alt="Delete" />
                        </button>
                        <button onClick={() => handleDelete(value.id, value.useremail)}>
                            <img id="edit-img" src="/images/icons8-edit.gif" alt="Delete" />
                            
                        </button>
                    </SharedActor>
                    <Description>{value.txtVal}</Description>
                    <SharedImg>
                        {value.imgUrl || value.videoLink ? (
                            (value.imgUrl)?
                            <img src={value.imgUrl} alt="Shared content" /> 
                            :
                            <ReactPlayer width={"100%"} url={value.videoLink} />
                        ):(
                            <p></p>
                        )}
                    </SharedImg>
                    <SocialCounts>
                        <li>
                            <button onClick={() => handleLike(value.id)}>
                                <img src="https://static-exp1.licdn.com/sc/h/d310t2g24pvdy4pt1jkedo4yb" alt="Like" />
                                <img src="https://static-exp1.licdn.com/sc/h/5thsbmikm6a8uov24ygwd914f" alt="Like" />
                                <span>{value.likes || 0}</span>
                            </button>
                        </li>
                        <li>
                            <a>{comments[value.id]?.length || 0} comments</a>
                        </li>
                    </SocialCounts>
                    <SocialActions>
                        <button onClick={() => handleLike(value)}>
                            <img src="/images/like-icon.png" alt="Like" />
                            <span>Like</span>
                        </button>
                        <button>
                            <img src="/images/comment-icon.svg" alt="Comment" />
                            <span>Comment</span>
                        </button>
                        <button>
                            <img src="/images/share-icon.png" alt="Share" />
                            <span>Share</span>
                        </button>
                        <button>
                            <img src="/images/send-icon.svg" alt="Send" />
                            <span>Send</span>
                        </button>
                    </SocialActions>
                    <CommentSection>
                        {comments[value.id]?.map((comment, index) => (
                            <Comment key={index}>
                                <strong>{comment.user}:</strong> {comment.text}
                            </Comment>
                        ))}
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleComment(value.id);
                                }
                            }}
                        />
                    </CommentSection>
                </Article>
            ))}
        </>
    );
};

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    color: black;
    background-color: rgba(0, 0, 0, 0.8);
    animation: fadeIn 0.3s;
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

const Content = styled.div`
    width: 100%;
    max-width: 552px;
    background-color: white;
    max-height: 90%;
    overflow: initial;
    border-radius: 5px;
    position: relative;
    display: flex;
    flex-direction: column;
    top: 32px;
    margin: 0 auto;
`;

const Header = styled.div`
    display: block;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    font-size: 16px;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.6);
    font-weight: 400;
    display: flex;
    justify-content: space-between;
    align-items: center;
    button {
        height: 40px;
        width: 40px;
        min-width: auto;
        color: rgba(0, 0, 0, 0.15);
        svg,
        img {
            pointer-events: none;
        }
    }
`;

const SharedContent = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-y: auto;
    vertical-align: baseline;
    background: transparent;
    padding: 8px 12px;
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    padding: 12px 24px;
    svg,
    img {
        width: 48px;
        height: 48px;
        background-clip: content-box;
        border: 2px solid transparent;
        border-radius: 50%;
    }
    span {
        font-weight: 600;
        font-size: 16px;
        line-height: 1.5;
        margin-left: 5px;
    }
`;

const SharedCreation = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px 24px 12px 16px;
`;

const AttachAssets = styled.div`
    align-items: center;
    display: flex;
    padding: 0 8px;
`;

const AssetButton = styled.button`
    display: flex;
    align-items: center;
    height: 40px;
    min-width: auto;
    color: rgba(0, 0, 0, 0.5);

    #video-button {
        height: 25px;
    }
`;

const ShareComment = styled.div`
    padding-left: 8px;
    margin-right: auto;
    border-left: 1px solid rgba(0, 0, 0, 0.15);

    ${AssetButton} {
        svg {
            margin-right: 5px;
        }
    }
`;

const PostButton = styled.button`
    min-width: 60px;
    border-radius: 20px;
    padding-left: 16px;
    padding-right: 16px;
    background: ${(props) => (props.disabled ? "rgba(0, 0, 0, 0.8)" : "#0a66c2")};
    color: ${(props) => (props.disabled ? "rgba(1, 1, 1, 0.2)" : "white")};

    &:hover {
        background: ${(props) => (props.disabled ? "rgba(0, 0, 0, 0.08)" : "#004182")};
    }
`;

const Editor = styled.div`
    padding: 12px 24px;
    textarea {
        width: 100%;
        min-height: 100px;
        resize: none;
    }

    input {
        width: 100%;
        height: 35px;
        font-size: 16px;
        margin-bottom: 20px;
    }
`;

const UploadImage = styled.div`
    text-align: center;
    img {
        width: 100%;
    }
`;

const Article = styled(CommonCard)`
    padding: 0;
    margin: 0 0 8px;
    overflow: visible;
`;

const SharedActor = styled.div`
    padding-right: 4px;
    flex-wrap: nowrap;
    padding: 12px 16px 0;
    margin-bottom: 8px;
    align-items: left;
    display: flex;
    width: 100%;
    a {
        margin-right: 12px;
        flex-grow: 1;
        overflow: hidden;
        display: flex;
        text-decoration: none;
        img {
            border-radius: 50%;
        }
        
        
    }
    


    button > img{
        height: 20px;
        width: 20px;
        padding: 10px;
        margin: 5px;
    }
    #del-img{
        margin-left: 10px; 
    }

    #edit-img{
        margin-right: 50px;
    }
    img {
        width: 48px;
        height: 48px;
    }
    
    
    div {
        display: flex;
        flex-direction: column;
        position: relative;
        top: 5px;
        flex-grow: 1;
        flex-basis: 0;
        margin-left: 15px;
        overflow: hidden;
    }

    span {
        text-align: left;
        &:first-child {
            font-size: 14px;
            font-weight: 700;
            color: rgba(0, 0, 0, 1);
        }

        &:nth-child(n+1) {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.6);
        }
    }
    button > img {
        height: 20px;
    }
    button {
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

    img {
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

    li {
        margin-right: 20px;
        font-size: 12px;

        button {
            display: flex;
            background: none;
            border: none;
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

    button > img {
        height: 15px;
    }

    button {
        display: inline-flex;
        align-items: center;
        padding: 5px 50px;
        color: #0a66c2;
        background: none;
        border: none;

        @media(min-width: 768px) {
            span {
                margin-left: 8px;
            }
        }
    }
`;

const CommentSection = styled.div`
    padding: 0 16px 16px;
    display: flex;
    flex-direction: column;
    
    input {
        width: 97.5%;
        padding: 8px;
        margin-top: 8px;
        margin-right: 8px;
        border-radius: 5px;
        border: 1px solid #e9e5df;
    }
`;

const Comment = styled.div`
    margin-top: 8px;
    padding: 2px;
    border: 1px solid #e9e5df;
    border-radius: 5px;
    background: #f9fafb;
    align-items: left;
    strong {

        font-weight: bold;
    }
`;

const mapStateToProps = (state) => {
    return {
        user: state.userState.user,
    };
};

export default connect(mapStateToProps)(PostModal);

