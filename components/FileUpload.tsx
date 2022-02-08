import React, { useState, useCallback } from "react";
import { addUser, selectUser } from '../src/features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { storage, db } from "../src/firebase";
import { doc, setDoc } from 'firebase/firestore';
import { store } from '../src/app/store';
import { Provider } from 'react-redux';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadString } from "firebase/storage";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const FileUpload = () => {
    console.log('test==============');
    const user = useSelector(selectUser);
    const [kyFile, setKyFile] = useState<string>('');
    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e: any) => {
                setKyFile(e.target.result);
                setName(file.name)
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        // console.log(kyFile);
        const storageRef = ref(storage, `/images/${name}`);
        const starsRef = ref(storage, `/images/${name}`);
        uploadString(storageRef, kyFile, 'data_url').then((snapshot) => {
            console.log('Uploaded a data_url string!', storageRef.root,);
            console.log('Uploaded a data_url string!');
            // console.log('Uploaded a data_url string!', storageRef.bucket);

            getDownloadURL(starsRef)
                .then((url) => {
                    console.log('Downloaded url:', url);
                    setDoc(doc(db, 'users', user.uid, 'img'), {
                        img_befor: { url },
                    }, { merge: true })
                })
            setKyFile('')
        }).catch((err) => {
            console.error(err)
            // alert("画像のみアップロードできます")
        });

    }
    const [name, setName] = useState('')
    return (
        <div className="App">
            <span>uploadコーナー</span>
            <br />
            <h1>
                <React.StrictMode>
                    <Provider store={store}>
                        {/* <PageA_profile /> */}
                        {/* <SimpleAccordion /> */}
                        <input type="file" onChange={onFileInputChange} />
                        {`${kyFile}`.length !== 0 &&
                            <div>
                                <img src={kyFile} alt={name} />
                                <br />
                                <button onClick={handleUpload}>Upload</button>
                            </div>
                        }
                        <br />
                    </Provider>
                </React.StrictMode>
            </h1>
        </div>
    );
};
export default FileUpload;
