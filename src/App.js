
import { useState } from 'react'
import { db } from './firebaseConnection'
import { doc , setDoc, collection, addDoc, getDoc, getDocs, updateDoc } from 'firebase/firestore'

import './app.css';


function App() {
  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [idPost, setIdPost] = useState('')

  const [posts, setPosts] = useState([])


  async function handleAdd() {
    // await setDoc(doc(collection(db, "posts"), "12345"), {
    //   titulo: titulo,
    //   autor: autor
    // })
    // .then(() => {
    //   console.log('POST ADICIONADO COM SUCESSO!')
    // }
    // )
    // .catch(() => {
    //   console.log('ERRO AO ADICIONAR POST' + error)
    // })


    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor
    })
    .then(() => {
      console.log('POST ADICIONADO COM SUCESSO!')
      setAutor('')
      setTitulo('')
    }
    )
    .catch((error) => {
      console.log('ERRO AO ADICIONAR POST' + error)
    })

  }

  async function buscarPost() {
    // const docRef = doc(db, "posts", "12345")
    // await getDoc(docRef)
    // .then((snapshot) => {
    //   setAutor(snapshot.data().autor)
    //   setTitulo(snapshot.data().titulo)
    // })
    // .catch((error) => {
    //   console.log('ERRO AO BUSCAR POST' + error)
    // })

    const postsRef = collection(db, "posts")
    await getDocs(postsRef)
    .then((snapshot) => {
      let lista = []
      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor
        })
      })
      setPosts(lista)
    })
    .catch((error) => {
      console.log('ERRO AO BUSCAR POST' + error)
    })

  }

  function atualizarPost() {
    alert('TESTE')
  }

  return (
    <div className="App">
      <h1>React Js + Firebase :)</h1>

      <div className='container'>

        <label>ID do post:</label>
        <input 
        placeholder='Digite o ID do post'
        value={idPost}
        onChange={ (e) => setIdPost(e.target.value)}
        /> <br />



        <label>Titulo:</label>
        <textarea
        type="text"
        placeholder='Digite o titulo' 
        value={titulo}
        onChange={ (e) => setTitulo(e.target.value)}
        />

        <label>Autor:</label>
        <input 
        type="text"
        placeholder='Autor do post'
        value={autor}
        onChange={ (e) => setAutor(e.target.value)}
        />

        <button onClick={handleAdd} >Adicionar Post</button>
        <button onClick={buscarPost}>Buscar post</button> <br />

        <button onClick={atualizarPost}>Atualizar Post</button>


        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <strong>ID: {post.id}</strong> <br />
                <p>Titulo: {post.titulo}</p>
                <p>Autor: {post.autor}</p>
              </li>
            )})
          }
        </ul>

      </div>

    </div>
  );
}

export default App;
