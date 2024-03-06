import React from 'react'

const Inventory = () => {
  return (
    <div>Inventory</div>
  )
}

export default Inventory


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Inventory = () => {
//     const [items, setItems] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     // State for form fields
//     const [name, setName] = useState('');
//     const [description, setDescription] = useState('');
//     const [price, setPrice] = useState('');
//     const [imageUrl, setImageUrl] = useState('');
//     const [category, setCategory] = useState('');
//     const [stockQuantity, setStockQuantity] = useState('');

//     // State for editing
//     const [editingItemId, setEditingItemId] = useState(null);

//     // Fetch items from backend
//     useEffect(() => {
//         const fetchItems = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get('/api/items');
//                 setItems(response.data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching items:', error);
//                 setError('Failed to fetch items');
//                 setLoading(false);
//             }
//         };
//         fetchItems();
//     }, []);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const itemData = { name, description, price, imageUrl, category, stockQuantity };

//         try {
//             if (editingItemId) {
//                 const response = await axios.put(`/api/items/${editingItemId}`, itemData);
//                 setItems(items.map(item => item._id === editingItemId ? response.data : item));
//             } else {
//                 const response = await axios.post('/api/items', itemData);
//                 setItems([...items, response.data]);
//             }
//             // Reset form
//             resetForm();
//         } catch (error) {
//             console.error('Error submitting item:', error);
//         }
//     };

//     const startEditing = (item) => {
//         setEditingItemId(item._id);
//         setName(item.name);
//         setDescription(item.description);
//         setPrice(item.price);
//         setImageUrl(item.imageUrl);
//         setCategory(item.category);
//         setStockQuantity(item.stockQuantity);
//     };

//     const resetForm = () => {
//         setName('');
//         setDescription('');
//         setPrice('');
//         setImageUrl('');
//         setCategory('');
//         setStockQuantity('');
//         setEditingItemId(null);
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`/api/items/${id}`);
//             setItems(items.filter(item => item._id !== id));
//         } catch (error) {
//             console.error('Error deleting item:', error);
//         }
//     };

//     return (
//         <div>
//             <h2>Inventory Management</h2>
//             {loading ? (
//                 <p>Loading items...</p>
//             ) : error ? (
//                 <p className="error">{error}</p>
//             ) : (
//                 <div>
//                     {items.map(item => (
//                         <div key={item._id} className="item">
//                             <h3>{item.name}</h3>
//                             <p>{item.description}</p>
//                             <p>Price: ${item.price}</p>
//                             <p>Category: {item.category}</p>
//                             <p>Stock: {item.stockQuantity}</p>
//                             <img src={item.imageUrl || 'placeholder.jpg'} alt={item.name} style={{ width: '100px', height: '100px' }} />
//                             <button onClick={() => startEditing(item)}>Edit</button>
//                             <button onClick={() => handleDelete(item._id)}>Delete</button>
//                         </div>
//                     ))}
//                 </div>
//             )}
//             <h3>{editingItemId ? 'Edit Item' : 'Add New Item'}</h3>
//             <form onSubmit={handleSubmit}>
//                 <label>Name:
//                     <input type="text" value={name} onChange={e => setName(e.target.value)} />
//                 </label>
//                 <label>Description:
//                     <textarea value={description} onChange={e => setDescription(e.target.value)} />
//                 </label>
//                 <label>Price:
//                     <input type="number" value={price} onChange={e => setPrice(e.target.value)} />
//                 </label>
//                 <label>Image URL:
//                     <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
//                 </label>
//                 <label>Category:
//                     <input type="text" value={category} onChange={e => setCategory(e.target.value)} />
//                 </label>
//                 <label>Stock Quantity:
//                     <input type="number" value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} />
//                 </label>
//                 <button type="submit">Submit</button>
//                 <button type="button" onClick={resetForm}>Reset</button>
//             </form>
//         </div>
//     );
// };

// export default Inventory;
