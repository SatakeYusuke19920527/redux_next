import React, { useState } from 'react';
import { addUser, selectUser } from '../src/features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/router";
import { store } from '../src/app/store';
import { Provider } from 'react-redux';
import dynamic from 'next/dynamic'
import PageB1 from '../src/PageB1'

const PageB = () => {
    const PageAA = dynamic(
        () => import('../src/PageAA'),
        { ssr: false }
    )

    // const [name, setName] = useState<string>('');
    // const [age, setAge] = useState<number>(0);
    // const user = useSelector(selectUser);
    // const router = useRouter()
    // const toPageA = () => {
    //     router.push('/')
    // }

    return (
        <div className="App">
            <span >pageA</span>
            <br />
            <h1>
                {/* {user.name}/{user.age} */}
                <React.StrictMode >
                    <Provider store={store}>
                        {/* <PageAA /> */}
                        <PageB1 />
                    </Provider>
                </React.StrictMode>
            </h1>
        </div >
    );
}

export default PageB