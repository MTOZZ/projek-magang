from app.model.warga import Warga
from app.model.produk import Produk
from app import response, app, db
from flask import request
from flask import jsonify

def index():
    try:
        warga = Warga.query.all()
        data = formatarray(warga)
        return response.success(data, "success")
    except Exception as e:
        print(e)
        return response.serverError([], "Internal Server Error")

def formatarray(datas):
    array = []
    for i in datas:
        array.append(singleObject(i))
    return array
        
def singleObject(data):
    data = {
        'id' : data.id,
        'name' : data.name,
        'wa' : data.wa,
        'email' : data.email,
    }
    return data

def detail(id):
    try:
        warga = Warga.query.filter_by(id=id).first()
        if not warga:
            return response.notFound([], 'Data warga tidak ditemukan')
        
        produk = Produk.query.filter_by(warga_id=id).all()
        dataproduk = formatProduk(produk)
        data = singleDetailProduk(warga, dataproduk)
        
        return response.success(data, "success")
    
    except Exception as e:
        print(e)
        return response.serverError([], "Internal Server Error")

def singleDetailProduk(warga, produk):
    data ={
        'id': warga.id,
        'name': warga.name,
        'wa': warga.wa,
        'email': warga.email,
        'produk': produk
    } 
    return data

def singleProduk(produk):
    data = {
        'id': produk.id,
        'name': produk.name,
        'harga': produk.harga,
        'deskripsi': produk.deskripsi
    }
    return data

def formatProduk(data):
    array = []
    for i in data:
        array.append(singleProduk(i))
    return array

def get(id):
    warga = Warga.query.get(id)
    if warga is None:
        return jsonify({'message': 'Warga not found'}), 404

    warga_dict = {
        'id': warga.id,
        'wa': warga.wa,
        'email': warga.email,
        # tambahkan field lainnya jika ada
    }

    return jsonify(warga_dict), 200
