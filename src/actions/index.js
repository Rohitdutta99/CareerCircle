import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { storage } from '../firebase';
import db from '../firebase';
import { SET_USER, SET_LOADING_STATUS } from './actionType';

// Action creators...

export const setUser = (payload) => ({
    type: SET_USER,
    user: payload,
});

export const setLoading = (status) => ({
    type: SET_LOADING_STATUS,
    status: status,
});

export const signInAPI = () => {
    return async (dispatch) => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            dispatch(setUser(result.user));
        } catch (error) {
            console.error('Error during sign-in:', error);
            dispatch({
                type: 'SIGN_IN_ERROR',
                error: error.message,
            });
        }
    };
};

export const getUserAuth = () => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                dispatch(setUser(user));
            } else {
                dispatch(setUser(null)); // Handle unauthenticated state
            }
        });
    };
};

export const signOutAPI = () => {
    return async (dispatch) => {
        const auth = getAuth();

        try {
            await signOut(auth);
            dispatch(setUser(null));
        } catch (error) {
            console.error('Error during sign-out:', error);
            // Handle sign-out error gracefully, e.g., show an error message to the user
        }
    };
};


export function postArticleAPI(payload) {
    return (dispatch) => {
        if (payload.image != '') {
            const upload = storage.ref(`image/${payload.image.name}`).put(payload.image);
            upload.on('state_changed',
                (snapshot) => {
                    const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

                    console.log(`progress: ${progress}%`)
                    if (snapshot.state === "RUNNING") {
                        console.log(`Progress: ${progress}%`)
                    }
                }, (error) => console.log(error.code),
                async () => {
                    const downloadURL = await upload.snapshot.ref.getDownloadURL();
                    db.collection("articles").add({
                        actor: {
                            description: payload.user.email,
                            title: payload.user.displayName,
                            date: payload.timestamp,
                            image: payload.user.photoURL
                        },
                        video: payload.video,
                        sharedImg: downloadURL,
                        comments: 0,
                        description: payload.description
                    })
                    dispatch(setLoading(false));
                }
            )
        }

        else if (payload.video) {
            db.collection("articles").add({
                actor: {
                    description: payload.user.email,
                    title: payload.user.displayName,
                    date: payload.timestamp,
                    image: payload.user.photoURL
                },
                video: payload.video,
                sharedImg: "",
                comments: 0,
                description: payload.description
            })
            dispatch(setLoading(false));
        }
    }
}

// export function getArticlesAPI() {
//     return (dispatch) =>{
//         let payload;

//         db.collection('articles')
//         .orderBy("actor.date", "desc")
//         .onSnaapshot((snapshot) => {
//             payload = snapshot.docs.map((doc) => doc.data());
//             console.log(payload);
//         })
//     }
// }

