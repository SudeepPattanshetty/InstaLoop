import { useEffect, useRef, useState } from 'react'
import '../src/index.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import Connections from './pages/Connections'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import ChatBox from './pages/ChatBox'
import { useAuth, useUser } from '@clerk/clerk-react'
import Layout from './pages/Layout'
import toast, { Toaster } from 'react-hot-toast'
import { fetchUser } from './features/user/userSlice.js'
import { useDispatch } from 'react-redux'
import { fetchConnections } from './features/connections/connectionSlice.js'
import { addMessages } from './features/messages/messageSlice.js'
import Notification from './components/Notification.jsx'
import CommentBox from './components/CommentBox.jsx'

function App() {

  const {user} = useUser()
  const {getToken} = useAuth()
  const dispatch = useDispatch()
  const {pathname} = useLocation()
  const pathnameRef = useRef(pathname)

  useEffect(() => {
      const fetchData = async() =>{
        if(user) {
          const token = await getToken()
          dispatch(fetchUser(token))
          dispatch(fetchConnections(token))
      }
      }
      fetchData()
  }, [user, getToken, dispatch])

  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  useEffect(() => {
    if(user) {
      const eventSource = new EventSource(import.meta.env.VITE_BASEURL + '/api/message/' + user.id);

      eventSource.onmessage = (event) => {
        const message = JSON.parse(event.data)
        if(pathnameRef.current === ('/messages/' + message.from_user_id.id)){
          dispatch(addMessages(message))
        }else{
          toast.custom((t) => (
            <Notification t={t} message={message} />
          ), {position: "bottom-right"})
        }
      }
      return () => {
        eventSource.close()
      }
    }
  }, [user, dispatch])

  return (
   <>
   <Toaster />
    <Routes>
    <Route path='/' element={!user ? <Login /> : <Layout />}>
      <Route index element={<Feed />} />
      <Route path='messages' element={<Messages />} />
      <Route path='messages/:userId' element={<ChatBox />} />
      <Route path='connections' element={<Connections />} />
      <Route path='discover' element={<Discover />} />
      <Route path='profile' element={<Profile />} />
      <Route path='profile/:profileId' element={<Profile />} />
      <Route path='create-post' element={<CreatePost />} />
      <Route path='comment-box' element={<CommentBox />} /> 
    </Route>
   </Routes>
   </>
  )
}

export default App
