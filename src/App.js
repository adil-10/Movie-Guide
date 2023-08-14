import React, { useState } from 'react';
import './App.css';
import './index.css';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';

import SignUp from './component/SignUp';
import Login from './component/Login';
import HomePage from './component/HomePage';
import ToWatchList from './component/ToWatchList';
import MoreInfo from './component/MoreInfo'
import UserInfo from './component/UserInfo';
import ShowNavBar from './component/ShowNavBar';

function App() {
  return (
    <BrowserRouter>
      <main>
        <ShowNavBar />
        <Routes>
          <Route index element={<SignUp />} />
          <Route path="Login" element={<Login />} />
          <Route path="HomePage" element={<HomePage />} />
          <Route path="ToWatchList" element={<ToWatchList />} />
          {/* Add movie_id as a param when a title is clicked on */}
          <Route path="MoreInfo/:movie_id" element={<MoreInfo />} />
          <Route path="UserInfo" element={<UserInfo />} />
        </Routes>
      </main>
    </BrowserRouter >
  );
}

export default App;