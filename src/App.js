import { useState, useEffect } from 'react'
import { db, auth } from './firebaseConnection';
import { doc, collection, addDoc, getDocs, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore'

import{ signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'


import './app.css';



function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState('')

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [user, setUser] = useState(false)
  const [userDetail, setUserDetail] = useState({})

  const [posts, setPosts] = useState([]);

  useEffect (()=> {
    async function loadPosts(){
      onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = []

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          })
        })

        setPosts(listaPost)
      })
    }

    loadPosts();
  }, [])

    useEffect(()=>{
      async function checkLogin(){
        onAuthStateChanged(auth, (user) => {
          if (user){
            console.log("USUÁRIO LOGADO")
            //SE O USUÁRIO ESTIVER LOGADO
            setUser(true)
            setUserDetail({
              uid: user.uid,
              email: user.email
            })
          }else{
            //SE O USUÁRIO NÃO ESTIVER LOGADO
            setUser(false)
            setUserDetail({})
          }
        })
      }

      checkLogin();
    }, [])


  async function handleAdd(){
    // await setDoc(doc(db, "posts", "12345"), {
    //   titulo: titulo,
    //   autor: autor,
    // })
    // .then(() => {
    //   console.log("DADOS REGISTRADO NO BANCO!")
    // })
    // .catch((error) => {
    //   console.log("GEROU ERRO" + error)
    // }) 


    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
    .then(() => {
      console.log("CADASTRADO COM SUCESSO")
      setAutor('');
      setTitulo('')
    })
    .catch((error) => {
      console.log("ERRO " + error)
    })


  }


  async function buscarPost(){
    // const postRef = doc(db, "posts", "vFvZAyFqebXFsFv0X89l")
    // await getDoc(postRef)
    // .then((snapshot) => {
    //   setAutor(snapshot.data().autor)
    //   setTitulo(snapshot.data().titulo)

    // })
    // .catch(()=>{
    //   console.log("ERRO AO BUSCAR")
    // })

    const postsRef = collection(db, "posts")
    await getDocs(postsRef)
    .then((snapshot) => {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        })
      })

      setPosts(lista);

    })
    .catch((error) => {
      console.log("DEU ALGUM ERRO AO BUSCAR")
    })


  }


  async function editarPost(){
    const docRef = doc(db, "posts", idPost)
    
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor
    })
    .then(() => {
      console.log("POST ATUALIZADO!")
      setIdPost('')
      setTitulo('')
      setAutor('')
    })
    .catch((error) => {
      console.log(error)
    })


  }

    async function excluirPost(id) {
      const docRef = doc(db, "posts", id)
      await deleteDoc(docRef)
      .then(() => {
        console.log("POST DELETADO")
      })
      .catch((error) => {
        console.log("ERRO AO DELETAR" + error)
      })
    } 

    async function novoUduario(){
      await createUserWithEmailAndPassword(auth, email, senha)
      .then(()=>{
        console.log("USUÁRIO CADASTRADO COM SUCESSO")
        setEmail('')
        setSenha('')
      })
      .catch((error) => {
        if (error.code === 'auth/weak-password'){
          alert("SENHA MUITO FRACA")
        }else if (error.code === 'auth/email-already-in-use'){
          alert("EMAIL JÁ CADASTRADO")
        }
      })
    }

    async function logarUsuario(){
      await signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log("USUÁRIO LOGADO COM SUCESSO")
        console.log(value.user)

        setUserDetail ({
          uid: value.user.uid,
          email: value.user.email
        })
        setUser(true)

        setEmail('')
        setSenha('')  
      })
      .catch((error) => {
        if (error.code === 'auth/wrong-password'){
          alert("SENHA INCORRETA")
        }else if (error.code === 'auth/user-not-found'){
          alert("USUÁRIO NÃO CADASTRADO")
        }
      })
    }


    async function fazerLogout(){
      await auth.signOut();
      setUser(false)
      setUserDetail({})
      console.log("USUÁRIO DESCONECTADO")
    }

  return (
    <div>
      <h1>ReactJS + Firebase :)</h1>

      {user && (
        <div>
          <strong>Seja Bem Vindo(a) (Você está logado!)</strong> <br />
          <strong>UID: {userDetail.uid}</strong> <br />
          <strong>Email: {userDetail.email}</strong> <br /> <br />
          <button onClick={fazerLogout}>Sair da conta</button>
          <br />
        </div>
      )}

      <div className="container">
        <h2>Usuaríos</h2>

        <label>Email</label>
        <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Digite seu email'
        /> <br />

        <label>Senha</label>
        <input 
        value={senha} 
        onChange={(e) => setSenha(e.target.value)}
        placeholder='Digite sua senha'
        /> <br />

        <button onClick={novoUduario}>Cadastrar</button>
        <button onClick={logarUsuario}>Fazer Login</button>

        

        
      </div>
      <br /><br />


    <div className="container">

      <h2>Posts</h2>

      <label>ID do Post:</label>
      <input
        placeholder='Digite o ID do post'
        value={idPost}
        onChange={ (e) => setIdPost(e.target.value) }
      /> <br/>

      <label>Titulo:</label>
      <textarea 
        type="text"
        placeholder='Digite o titulo'
        value={titulo}
        onChange={ (e) => setTitulo(e.target.value) }
      />

      <label>Autor:</label>
      <input 
        type="text" 
        placeholder="Autor do post"
        value={autor}
        onChange={(e) => setAutor(e.target.value) }
      />

      <button onClick={handleAdd}>Cadastrar</button>
      <button onClick={buscarPost}>Buscar post</button> <br/>

      <button onClick={editarPost}>Atualizar post</button>


      <ul>
        {posts.map( (post) => {
          return(
            <li key={post.id}>
              <strong>ID: {post.id}</strong> <br/>
              <span>Titulo: {post.titulo} </span> <br/>
              <span>Autor: {post.autor}</span> <br/> 
              <button onClick={() => excluirPost(post.id)}>Excluir</button> <br/>  <br/> 
            </li>
          )
        })}
      </ul>

    </div>

    </div>
  );
}

export default App;
