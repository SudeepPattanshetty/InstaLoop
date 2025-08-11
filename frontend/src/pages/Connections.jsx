import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  dummyFollowersData as followers,
  dummyFollowingData as following,
  dummyPendingConnectionsData as pending,
  dummyConnectionsData as connections
} from '../assets/assets';
import { MessageSquare, User, UserCheck, UserPlus, UserRoundPen } from 'lucide-react';

const Connections = () => {

  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('Followers');

  const dataArray = [
    {label: 'Followers', value: followers, icon: User},
    {label: 'Following', value: following, icon: UserCheck},
    {label: 'Pending', value: pending, icon: UserRoundPen},
    {label: 'Connections', value: connections, icon: UserPlus}
  ]

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6'>

      <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Connections</h1>
          <p className="text-slate-600">Manage your network and discover new connections</p>
        </div>

        {/* Counts */}
        <div className='flex flex-wrap mb-8 gap-6'>
          {dataArray.map((item, index) => (
            <div className='flex flex-col border border-gray-200 rounded-md gap-1 justify-center items-center h-20 w-40 shadow bg-white'>
              <b>{item.value.length}</b>
              <p className='text-slate-600'>{item.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className='inline-flex flex-wrap items-center border border-gray-200 rounded-md p-1 bg-white shadow-sm'>
          {dataArray.map((tab) => (
            <button onClick={() => setCurrentTab(tab.label)} key={tab.label} className={`cursor-pointer flex items-center px-3 py-1 text-sm rounded-md transition-colors ${currentTab === tab.label ? 'bg-white font-medium text-black' : 'text-gray-500 hover:text-black'}`}>
              <tab.icon className='w-4 h-4' />
              <span className='ml-1'>{tab.label}</span>
              {tab.count !== undefined && (
                <span className='ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full' >{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Connections */}
        <div className='flex flex-wrap gap-6 mt-6'>
        {
          dataArray.find((item) => item.label === currentTab).value.map((user) => (
            <div key={user._id} className='w-full max-w-88 flex gap-5 p-6 bg-white shadow rounded-md'>
              <img src={user.profile_picture} alt="" className='rounded-full w-12 h-12 shadow-md mx-auto' />
              <div className='flex-1'>
                <p className='font-medium text-slate-700'>{user.full_name}</p>
                <p className='text-slate-500'>@{user.username}</p>
                <p className='text-sm text-gray-600'>{user.bio.slice(0, 3)}...</p>
                <div className='flex max-sm:flex-col gap-2 mt-4'>
                  {
                    <button onClick={() => navigate(`/profile/${user._id}`)} className='w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer'>View Profile</button>
                  }
                  {
                    currentTab === "Following" && (
                      <button className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:slate-95 transition cursor-pointer'>Unfollow</button>
                    )
                  }
                  {
                    currentTab === "Pending" && (
                      <button className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:slate-95 transition cursor-pointer'>Accept</button>
                    )
                  }
                  {
                    currentTab === "Connections" && (
                      <button onClick={() => navigate(`/message/${user._id}`)} className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:slate-95 transition cursor-pointer flex items-center justify-center gap-1'>
                        <MessageSquare className='w-4 h-4' />Message
                      </button>
                    )
                  }
                </div>
              </div>
            </div>
          ))
        }
        </div>
      </div>
    </div>
  )
}

export default Connections

