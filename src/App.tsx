import React, { useState, useEffect } from 'react';
import { addUser, selectUser } from '../src/features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import 'firebase/compat/firestore';
import liff from '@line/liff';

export default function App() {
  const [uid, setUid] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [icon, setIcon] = useState<string | undefined>('');
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const router = useRouter();

  useEffect(() => {
    liff
      .init({ liffId: process.env.NEXT_PUBLIC_REACT_APP_LIFF_ID as string })
      .then(async () => {
        if (liff.isLoggedIn()) {
          console.log('login status : [', true, ']');
          const profile = await liff.getProfile();
          console.log(
            '🚀 ~ file: Login.tsx ~ line 15 ~ liff.init ~ profile',
            profile
          );
          // const userId: string = profile.userId
          const displayName: string = profile.displayName;
          const displayicon: string | undefined = profile.pictureUrl;
          setName(profile.displayName);
          setUid(profile.userId);
          setName(displayName);
          setIcon(displayicon);
          dispatch(
            addUser({
              name: profile.displayName,
              uid: profile.userId,
              icon: profile.pictureUrl,
            })
          );
        } else {
          console.log('login status : [', false, ']');
        }
      });
  }, [dispatch]);

  // const loginUrl: string | undefined = process.env.NEXT_PUBLIC_LINE_LOGIN_URL;
  const LINEID = process.env.NEXT_PUBLIC_REACT_APP_LIFF_ID;
  const lineClick = () => {
    setUid('');
    liff.init({ liffId: LINEID as string }).then(() => {
      if (!liff.isLoggedIn()) {
        setUid('k00000');
        liff.login(); // ログインしていなければ最初にログインする
      } else if (liff.isInClient()) {
        console.log('hello world');
      }
    });
  }; ///先生

  const toPageC = () => {
    router.push('./PageC');
  };
  const toPageB = () => {
    router.push('./PageB');
  };
  const registB = () => {
    dispatch(addUser({ name, uid, icon }));
    // toPageA()
    toPageB();
  };
  const registC = () => {
    dispatch(addUser({ name, uid, icon }));
    // toPageA()
    toPageC();
  };

  return (
    <div className="App">
      {user.uid === '' && (
        <div>
          <button onClick={lineClick}>
            <h4 className="mb-4 text-green-500 text-3xl">ログイン</h4>
          </button>
        </div>
      )}
      {user.uid !== '' && (
        <div>
          <h2 className="mb-4  text-3xl">ようこそ</h2>
        </div>
      )}
      {user.uid !== '' && (
        <div>
          <button onClick={registC}>
            <h3 className="mb-4 text-green-500 text-3xl">
              ケアビューティスト専用
            </h3>
          </button>
        </div>
      )}
      {user.uid !== '' && (
        <div>
          <button onClick={registB}>
            <h3 className="mb-4 text-green-500 text-3xl">個人で申し込む</h3>
          </button>
        </div>
      )}
      {user.uid !== '' && (
        <div>
          <button onClick={registB}>
            <h3 className="mb-4 text-green-500 text-3xl">施設で申し込む</h3>
          </button>
        </div>
      )}
      {user.uid !== '' && (
        <div>
          <button onClick={registB}>
            <h3 className="mb-4 text-green-500 text-3xl">
              プレゼントとして申し込む
            </h3>
          </button>
        </div>
      )}
    </div>
  );
}
