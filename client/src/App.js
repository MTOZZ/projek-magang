import React from 'react';
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Visimisi from './components/pages/Visimisi';
import Sejarah from './components/pages/Sejarah';
import Produk from './components/pages/Produk';
import ProdukKategori from './components/pages/ProdukKategori';
import Keunggulan from './components/pages/Keunggulan';
import DetailProduk from './components/pages/DetailProduk';
import HomeAdmin from './components/admin/pagesadmin/HomeAdmin';
import AdminBanner from './components/admin/pagesadmin/AdminBanner';
import ProfilDesaAdmin from './components/admin/pagesadmin/ProfilDesaAdmin';
import ProdukDesaAdmin from './components/admin/pagesadmin/ProdukDesaAdmin';
import AdminArtikel from './components/admin/pagesadmin/AdminArtikel';
import AdminData from './components/admin/pagesadmin/AdminData';
import LoginAdmin from './components/admin/pagesadmin/LoginAdmin';
import ForgotPassword from './components/admin/pagesadmin/ForgotPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profildesa' element={<Home />} />
        <Route path='/visimisi' element={<Visimisi />} />
        <Route path='/sejarah' element={<Sejarah />} />
        <Route path='/keunggulan' element={<Keunggulan />} />
        <Route path='/produkdesa' element={<ProdukKategori />} />
        <Route path='/produk' element={<Produk />} />
        <Route path="/produkdetail/:id" element={<DetailProduk />} />
        <Route path="/homeadmin" element={<HomeAdmin />} />
        <Route path="/banneradmin" element={<AdminBanner />} />
        <Route path="/profildesaadmin" element={<ProfilDesaAdmin />} />
        <Route path="/produkdesaadmin" element={<ProdukDesaAdmin />} />
        <Route path="/artikeladmin" element={<AdminArtikel />} />
        <Route path="/akunadmin" element={<AdminData />} />
        <Route path="/login" element={<LoginAdmin />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
