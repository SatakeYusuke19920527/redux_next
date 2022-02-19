import React, { useState, useEffect } from 'react';
import { addUser, selectUser } from '../src/features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { UserState } from "../src/types/user";
import 'firebase/compat/firestore';
// import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase';
import liff from '@line/liff';
import dynamic from 'next/dynamic';
import { getDocs, collection, collectionGroup, query, orderBy, where, doc, setDoc, serverTimestamp, deleteDoc, onSnapshot } from 'firebase/firestore'
import { TomareState } from "../src/types/tomare";
import CustomerAccordion from '../components/CustomerAccordion';
import styles from '../styles/Home.module.css'
import PayAccordion from '../components/PayAccordion';
import { Provider } from 'react-redux';
import { store } from '../src/app/store';

export default function App() {
  const [uid, setUid] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [icon, setIcon] = useState<string | undefined>('');
  const [tomare, setTomare] = useState<any>([]);
  const [pay, setPay] = useState<any>([]);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const router = useRouter();
  const PageA = dynamic(() => import('../pages/PageA'), { ssr: false });
  // const PagePay = dynamic(() => import('./PagePay'), { ssr: false });

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

          console.log('uid', uid)
          console.log('profile.userId', profile.userId)
          const q = query(collection(db, 'yoyakuPay',), where("yoyakuUid", "==", `${uid}`));
          const snapshot = await getDocs(q)
          const payData = snapshot.docs.map(
            (doc) => ({ ...doc.data() } as TomareState))
          console.log('payData:', payData)
          dispatch(addUser(payData))
          setPay(payData)
          dispatch(
            addUser({
              name: profile.displayName,
              uid: profile.userId,
              icon: profile.pictureUrl,
            })
          );
          const setRef = setDoc(
            doc(db, 'users', `${uid}`),
            {
              uid,
              name,
              icon,
              timestamp: '',
            },
            { merge: true });

        } else {
          console.log('login status : [', false, ']');
        }
      });
    // fetchUser()
    // fetchPay()
  }, [dispatch]);

  useEffect(() => {
    console.log(`${user.uid}`)
    const fetchPay = async (uid: string) => {
      const q = query(collection(db, 'yoyakuPay'), where("yoyakuUid", "==", `${user.uid}`));
      const snapshot = onSnapshot(q, (querySnapshot) => {
        const payData = querySnapshot.docs.map(
          (doc) => ({ ...doc.data() } as TomareState))
        console.log('payData:', payData)
        dispatch(addUser(payData))
        setPay(payData)
      });
    }
    fetchPay(uid)
    // fetchTomare()
    console.log('pey:', pay)
  }, []);
  // const fetchPay = async () => {
  //   const q = query(collection(db, 'yoyakuPay',), where("yoyakuUid", "==", `${user.uid}`));
  //   const snapshot = await getDocs(q)
  //   const payData = snapshot.docs.map(
  //     (doc) => ({ ...doc.data() } as TomareState))
  //   console.log('payData:', payData)
  //   dispatch(addUser(payData))
  //   setPay(payData)
  // }
  const fetchUser = async () => {
    const q = query(collection(db, 'users',), where("uid", "==", `${user.uid}`));
    const snapshot = await getDocs(q)
    const userData = snapshot.docs.map(
      (doc) => ({ ...doc.data() } as UserState))
    console.log('userData:', userData)
    dispatch(addUser(userData))
    // setUserProfile(userData)
  }
  const fetchTomare = async () => {
    const q = query(collectionGroup(db, 'tomare'), where("yoyakuUid", "==", `${user.uid}`));
    const snapshot = onSnapshot(q, (querySnapshot) => {
      const tomareData = querySnapshot.docs.map(
        (doc) => ({ ...doc.data() } as TomareState))
      // dispatch(addTomare(tomareData))
      setTomare(tomareData)
    });
  }
  //   fetchTomare()
  //   console.log('User:', user)
  //   console.log('tomare:', tomare)
  // }, []);


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

  const toPageA = () => {
    router.push('./PageA');
  };
  const toPageB = () => {
    router.push('./PageB');
  };
  const toPageC = () => {
    router.push('./PageC');
  };
  const toPagePay = () => {
    router.push('./PagePay');
  };
  const registA = () => {
    dispatch(addUser({ name, uid, icon }));
    toPageA()
  };
  const registB = () => {
    dispatch(addUser({ name, uid, icon }));
    toPageB();
  };
  const registC = () => {
    dispatch(addUser({ name, uid, icon }));
    toPageC();
  };
  const registPay = () => {
    dispatch(addUser({ name, uid, icon }));
    toPagePay()
  };
  return (
    <main className={styles.main}>
      <br />
      app:{uid}
      <img
        src={user.icon}
        alt=""
        style={{ borderRadius: '50%', width: '60px', height: '60px' }}
      />
      <img
        src={`${icon}`}
        alt=""
        style={{ borderRadius: '50%', width: '60px', height: '60px' }}
      />
      <h1>
        <React.StrictMode>
          <Provider store={store}>
            <br />
            {pay
              .map((pay: TomareState) => {
                return (
                  <div key={pay.tomareId}>
                    {/* {`${tomare.yoyakuMenu}` !== "" && */}
                    <div className={styles.grid}>
                      <PayAccordion pay={pay} key={pay.tomareId} />
                    </div>
                    {/* } */}
                  </div>
                )
              })}
          </Provider>
        </React.StrictMode>
      </h1>
      <br />
      <br />
      *************************************************


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
            {/* <h3 className="mb-4  text-3xl">
            ケアビューティスト
          </h3> */}
            <button onClick={registA}>
              <h3 className="mb-4 text-green-500 text-3xl">
                マイページ
              </h3>
            </button>
          </div>
        )}
        {user.uid !== '' && (
          <div>
            <button onClick={registPay}>
              <h3 className="mb-4 text-green-500 text-3xl">
                履歴
              </h3>
            </button>
          </div>
        )}
        {user.uid !== '' && (
          <div>
            <button onClick={registC}>
              <h3 className="mb-4 text-green-500 text-3xl">
                予約枠設定
              </h3>
            </button>
          </div>
        )}

        {user.uid !== '' && (

          <div>
            <h3 className="mb-4  text-3xl">
              施術申込み
            </h3>
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
        {/* {uid !== '' && (
        <div>
          <button onClick={registB}>
            <h3 className="mb-4 text-green-500 text-3xl">
              プレゼントする
            </h3>
          </button>
        </div>
      )} */}
        <footer className={styles.footer}>
          {/* <a href="https://konoyubi.site" target="_blank" rel="noopener noreferrer"        > */}
          Powered by{' '}
          <span className={styles.logo} onClick={lineClick}>
            konoyubi</span>
          {/* </a> */}
        </footer>
      </div>
    </main>
  );
}
