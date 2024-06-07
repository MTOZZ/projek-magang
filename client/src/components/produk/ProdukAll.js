import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import './ProdukAll.css'; // import CSS

const ProdukAll = () => {
    const [produk, setProduk] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [kategoriId, setKategoriId] = useState(null);
    const [kategori, setKategori] = useState([]);
    const [kategoriProduk, setKategoriProduk] = useState({}); // Tambahkan state baru untuk menyimpan kategori dan produk terkait
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const newKategoriId = params.get('kategoriId');
        const storage = getStorage();
        const storageRef = ref(storage, 'images/produk/');
        const apiUrl = newKategoriId 
            ? `http://localhost:5000/produk?kategoriId=${newKategoriId}` 
            : `http://localhost:5000/produk`;

        setKategoriId(newKategoriId);

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const sortedProduk = data.sort((a, b) => a.name.localeCompare(b.name));
                    setProduk(sortedProduk);
                } else if (data && data.data && Array.isArray(data.data)) {
                    const sortedProduk = data.data.sort((a, b) => a.name.localeCompare(b.name));
                    setProduk(sortedProduk);
                } else {
                    console.error('Unexpected data format:', data);
                    setProduk([]);
                }
            })
            .catch(error => console.error('Error:', error));

        listAll(storageRef)
            .then((res) => {
                const urls = res.items.map((itemRef) => getDownloadURL(itemRef));
                Promise.all(urls)
                    .then((downloadURLs) => {
                        setImageUrls(downloadURLs);
                    })
                    .catch((error) => {
                        console.error("Error fetching download URLs:", error);
                    });
            })
            .catch((error) => {
                console.error("Error listing items in storage:", error);
            });

        fetch('http://localhost:5000/kategori')
            .then(response => response.json())
            .then(data => {
                if (data.data && data.data.length > 0) {
                    const kategoriData = data.data;
                    setKategori(kategoriData);

                    // Buat objek untuk menyimpan produk berdasarkan kategori
                    const kategoriProdukPromises = kategoriData.map(kategoriItem =>
                        fetch(`http://localhost:5000/produk?kategoriId=${kategoriItem.id}`)
                            .then(response => response.json())
                            .then(produkData => ({ [kategoriItem.id]: produkData }))
                    );

                    Promise.all(kategoriProdukPromises)
                        .then(results => {
                            const produkByKategori = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
                            setKategoriProduk(produkByKategori);
                        })
                        .catch(error => console.error('Error fetching produk by kategori:', error));
                }
            })
            .catch(error => console.error('Error:', error));
    }, [location.search]);

    const handleShowClick = (kategoriId) => {
        window.location.href = `/produk?kategoriId=${kategoriId}`;
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="container-sm">
            <div className="page-all-produk">
                <i className="fa-solid fa-house"><p className="teks-icon">/ PRODUK DESA</p></i>
                <h2 className="title-produk">PRODUK DESA KASSI</h2>
            </div>
            <div className="search-bar">
                <div className="search-input-container">
                    <input 
                        type="text" 
                        placeholder="Search" 
                        value={searchTerm} 
                        onChange={handleSearchChange} 
                    />
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                </div>
            </div>
            <div className="kategori-buttons-container">
                <div className="kategori-buttons">
                    {kategori.map((item, index) => (
                        kategoriProduk[item.id] && kategoriProduk[item.id].length > 0 && (
                            <button key={index} onClick={() => handleShowClick(item.id)}>
                                {item.name}
                            </button>
                        )
                    ))}
                </div>
            </div>
            <div className="card-produk">
                {produk
                    .filter((item) =>
                        item.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((item, index) => (
                        <div key={index} className="produk-card">
                            {imageUrls.map((url, idx) => {
                                if (url.endsWith(item.foto)) {
                                    return <img key={idx} src={url} alt={item.name} className="card-images" />;
                                }
                                return null;
                            })}
                            <h4 className="card-title-produkall">{item.name}</h4>
                            <Link to={`/produkdetail/${item.id}`}>
                                <button className="detail-button">Selengkapnya</button>
                            </Link>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ProdukAll;
