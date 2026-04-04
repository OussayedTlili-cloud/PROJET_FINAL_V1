import API from './api';

export const getProducts = async () => {
    const response = await API.get('/products');
    return response.data;
};

export const getProductById = async (id) => {
    const response = await API.get(`/products/${id}`);
    return response.data;
};

export const createProduct = async (productData) => {
    const response = await API.post('/products', productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateProduct = async (id, productData) => {
    const response = await API.put(`/products/${id}`, productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await API.delete(`/products/${id}`);
    return response.data;
};
