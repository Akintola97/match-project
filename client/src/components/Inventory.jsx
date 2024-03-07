// // import React from 'react'

// // const Inventory = () => {
// //   return (
// //     <div>Inventory</div>
// //   )
// // }

// // export default Inventory

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const Inventory = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // State for form fields
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [imageUrl, setImageUrl] = useState("");
//   const [category, setCategory] = useState("");
//   const [stockQuantity, setStockQuantity] = useState("");

//   // State for editing
//   const [editingItemId, setEditingItemId] = useState(null);

//   // Fetch items from backend
//   useEffect(() => {
//     const fetchItems = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get("/admin/items");
//         // console.log(response.data)
//         setItems(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching items:", error);
//         setError("Failed to fetch items");
//         setLoading(false);
//       }
//     };
//     fetchItems();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const itemData = {
//       name,
//       description,
//       price,
//       imageUrl,
//       category,
//       stockQuantity,
//     };

//     try {
//       if (editingItemId) {
//         const response = await axios.put(
//           `/admin/items/${editingItemId}`,
//           itemData
//         );
//         setItems(
//           items.map((item) =>
//             item._id === editingItemId ? response.data : item
//           )
//         );
//       } else {
//         const response = await axios.post("/api/items", itemData);
//         setItems([...items, response.data]);
//       }
//       // Reset form
//       resetForm();
//     } catch (error) {
//       console.error("Error submitting item:", error);
//     }
//   };

//   const startEditing = (item) => {
//     setEditingItemId(item._id);
//     setName(item.name);
//     setDescription(item.description);
//     setPrice(item.price);
//     setImageUrl(item.imageUrl);
//     setCategory(item.category);
//     setStockQuantity(item.stockQuantity);
//   };

//   const resetForm = () => {
//     setName("");
//     setDescription("");
//     setPrice("");
//     setImageUrl("");
//     setCategory("");
//     setStockQuantity("");
//     setEditingItemId(null);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`/admin/items/${id}`);
//       setItems(items.filter((item) => item._id !== id));
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     }
//   };

//   return (
//     <div className="h-full w-full pt-[10vh]">
//       <h1>Inventory Management</h1>
//       {loading ? (
//         <div className="flex justify-center items-center h-full w-full">
//           <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
//         </div>
//       ) : error ? (
//         <p className="error">{error}</p>
//       ) : (
//         <div className="w-full h-full">
//           {items.map((item) => (
//             <div key={item._id} className="item">
//               <h3>{item.name}</h3>
//               <p>{item.description}</p>
//               <p>Price: ${item.price}</p>
//               <p>Category: {item.category}</p>
//               <p>Stock: {item.stockQuantity}</p>
//               <img
//                 src={item.imageUrl || "placeholder.jpg"}
//                 alt={item.name}
//                 style={{ width: "100px", height: "100px" }}
//               />
//               <button onClick={() => startEditing(item)}>Edit</button>
//               <button onClick={() => handleDelete(item._id)}>Delete</button>
//             </div>
//           ))}
//         </div>
//       )}
//       <h3>{editingItemId ? "Edit Item" : "Add New Item"}</h3>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Name:
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//         </label>
//         <label>
//           Description:
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </label>
//         <label>
//           Price:
//           <input
//             type="number"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//           />
//         </label>
//         <label>
//           Image URL:
//           <input
//             type="text"
//             value={imageUrl}
//             onChange={(e) => setImageUrl(e.target.value)}
//           />
//         </label>
//         <label>
//           Category:
//           <input
//             type="text"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           />
//         </label>
//         <label>
//           Stock Quantity:
//           <input
//             type="number"
//             value={stockQuantity}
//             onChange={(e) => setStockQuantity(e.target.value)}
//           />
//         </label>
//         <button type="submit">Submit</button>
//         <button type="button" onClick={resetForm}>
//           Reset
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Inventory;

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const Inventory = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // State for form fields
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [imageUrl, setImageUrl] = useState("");
//   const [category, setCategory] = useState("");
//   const [stockQuantity, setStockQuantity] = useState("");

//   // State for editing
//   const [editingItemId, setEditingItemId] = useState(null);

//   useEffect(() => {
//     const fetchItems = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get("/admin/items");
//         setItems(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching items:", error);
//         setError("Failed to fetch items");
//         setLoading(false);
//       }
//     };
//     fetchItems();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const itemData = {
//       name,
//       description,
//       price,
//       imageUrl,
//       category,
//       stockQuantity,
//     };

//     try {
//       let response;
//       if (editingItemId) {
//         response = await axios.put(`/admin/items/${editingItemId}`, itemData);
//         setItems(items.map(item => item._id === editingItemId ? response.data : item));
//       } else {
//         response = await axios.post('/admin/items', itemData);
//         setItems([...items, response.data]);
//       }
//       resetForm();
//     } catch (error) {
//       console.error("Error submitting item:", error);
//     }
//   };

//   const startEditing = (item) => {
//     setEditingItemId(item._id);
//     setName(item.name);
//     setDescription(item.description);
//     setPrice(item.price);
//     setImageUrl(item.imageUrl);
//     setCategory(item.category);
//     setStockQuantity(item.stockQuantity);
//   };

//   const resetForm = () => {
//     setName("");
//     setDescription("");
//     setPrice("");
//     setImageUrl("");
//     setCategory("");
//     setStockQuantity("");
//     setEditingItemId(null);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`/admin/items/${id}`);
//       setItems(items.filter(item => item._id !== id));
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full w-full mx-auto bg-gray-900 text-gray-200 pt-[10vh] px-4">
//       <h1 className="text-3xl font-bold text-center p-3">Inventory Management</h1>
//       {loading ? (
//         <div className="flex justify-center items-center h-full">
//           <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
//         </div>
//       // ) : error ? (
//       //   <p className="text-red-500">{error}</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {items.map((item) => (
//             <div key={item._id} className="bg-gray-800 p-6 rounded-lg">
//               <img src={item.imageUrl || "placeholder.jpg"} alt={item.name} className="w-full h-32 object-cover object-center mb-4 rounded" />
//               <h3 className="text-lg text-white font-medium title-font mb-2">{item.name}</h3>
//               <p className="leading-relaxed text-base">{item.description}</p>
//               <p className="mt-3">Price: ${item.price}</p>
//               <p>Stock: {item.stockQuantity}</p>
//               <div className="flex justify-between items-center mt-4">
//                 <button onClick={() => startEditing(item)} className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
//                   Edit
//                 </button>
//                 <button onClick={() => handleDelete(item._id)} className="text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded">
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//       {/* Add New Item Form or Edit Item Form */}
//       <div className="mt-10">
//         <h3 className="text-2xl font-bold mb-6">{editingItemId ? "Edit Item" : "Add New Item"}</h3>
//         <form onSubmit={handleSubmit} className="bg-gray-800 shadow-lg rounded-lg p-8 mb-4">
//           <div className="mb-6">
//             <label className="block text-gray-200 text-sm font-bold mb-2">
//               Name:
//             </label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block text-gray-200 text-sm font-bold mb-2">
//               Description:
//             </label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block text-gray-200 text-sm font-bold mb-2">
//               Price:
//             </label>
//             <input
//               type="number"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block text-gray-200 text-sm font-bold mb-2">
//               Image URL:
//             </label>
//             <input
//               type="text"
//               value={imageUrl}
//               onChange={(e) => setImageUrl(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block text-gray-200 text-sm font-bold mb-2">
//               Category:
//             </label>
//             <input
//               type="text"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block text-gray-200 text-sm font-bold mb-2">
//               Stock Quantity:
//             </label>
//             <input
//               type="number"
//               value={stockQuantity}
//               onChange={(e) => setStockQuantity(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               required
//             />
//           </div>
//           <div className="flex items-center justify-between">
//             <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
//               {editingItemId ? "Update Item" : "Add Item"}
//             </button>
//             <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={resetForm}>
//               Reset
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Inventory;

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const Inventory = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // State for form fields
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [imageUrl, setImageUrl] = useState("");
//   const [category, setCategory] = useState("");
//   const [stockQuantity, setStockQuantity] = useState("");

//   // State for editing
//   const [editingItemId, setEditingItemId] = useState(null);

//   // Fetch items from backend
//   useEffect(() => {
//     const fetchItems = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get("/admin/items");
//         setItems(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching items:", error);
//         setError("Failed to fetch items");
//         setLoading(false);
//       }
//     };
//     fetchItems();
//   }, []);

//   // Submit form for adding or editing item
//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   const itemData = { name, description, price, imageUrl, category, stockQuantity };

//   //   try {
//   //     let response;
//   //     if (editingItemId) {
//   //       response = await axios.put(`/admin/items/${editingItemId}`, itemData);
//   //       setItems(items.map(item => item._id === editingItemId ? response.data : item));
//   //     } else {
//   //       response = await axios.post('/admin/items', itemData);
//   //       setItems([...items, response.data]);
//   //     }
//   //     resetForm();
//   //   } catch (error) {
//   //     console.error("Error submitting item:", error);
//   //   }
//   // };

//   // Submit form for adding or editing item
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   const itemData = { name, description, price, imageUrl, category, stockQuantity };

//   try {
//     let response;
//     if (editingItemId) {
//       // If editingItemId exists, update the item
//       response = await axios.put(`/admin/items/${editingItemId}`, itemData);
//       setItems(items.map(item => item._id === editingItemId ? response.data : item));
//     } else {
//       // If no editingItemId, create new item
//       response = await axios.post('/admin/items', itemData);
//       setItems([...items, response.data]);
//     }
//     resetForm();
//   } catch (error) {
//     console.error("Error submitting item:", error);
//   }
// };

import React, { useState, useEffect } from "react";
import axios from "axios";
import { PencilIcon, TrashIcon } from '@heroicons/react/solid';


const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // States for form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0); // Default to 0 for number input
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [stockQuantity, setStockQuantity] = useState(0); // Default to 0 for number input

  // State for editing
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/admin/items");
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
      setError("Failed to fetch items");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemData = {
      name,
      description,
      price,
      imageUrl,
      category,
      stockQuantity,
    };

    if (editingItemId) {
      await updateItem(editingItemId, itemData);
    } else {
      await createItem(itemData);
    }
  };

  const createItem = async (itemData) => {
    try {
      const response = await axios.post("/admin/items", itemData);
      console.log(response.data);
      setItems([...items, response.data]);
      resetForm();
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  const updateItem = async (itemId, itemData) => {
    try {
      const response = await axios.put(`/admin/items/${itemId}`, itemData);
      setItems(
        items.map((item) => (item._id === itemId ? response.data : item))
      );
      resetForm();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const startEditing = (item) => {
    setEditingItemId(item._id);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    setImageUrl(item.imageUrl);
    setCategory(item.category);
    setStockQuantity(item.stockQuantity);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice(0);
    setImageUrl("");
    setCategory("");
    setStockQuantity(0);
    setEditingItemId(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admin/items/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="flex flex-col h-full w-full mx-auto bg-gray-900 text-gray-200 pt-[10vh] px-4">
      <h1 className="text-3xl font-bold text-center mb-10">
        Inventory Management
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-gray-800 p-6 rounded-lg">
              <img
                src={item.imageUrl || "placeholder.jpg"}
                alt={item.name}
                className="w-full h-32 object-cover object-center mb-4 rounded"
              />
              <h3 className="text-lg text-white font-medium title-font mb-2">
                {item.name}
              </h3>
              <p className="leading-relaxed text-base">{item.description}</p>
              <p className="mt-3">Price: ${item.price}</p>
              <p>Stock: {item.stockQuantity}</p>
              {/* <div className="flex justify-between items-center mt-4">
                <button 
                  onClick={() => startEditing(item)}
                  className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
                >
                  <PencilIcon className="h-5 w-5 text-white" />
                </button>
              </div> */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => startEditing(item)}
                  className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
                >
                  <PencilIcon className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
                >
                  <TrashIcon className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-6">Add New Item</h3>
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 shadow-lg rounded-lg p-8 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-200 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Item Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-200 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description:
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              placeholder="Item Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-200 text-sm font-bold mb-2"
              htmlFor="price"
            >
              Price ($):
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="price"
              type="number"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-200 text-sm font-bold mb-2"
              htmlFor="imageUrl"
            >
              Image URL:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="imageUrl"
              type="text"
              placeholder="http://"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-200 text-sm font-bold mb-2"
              htmlFor="category"
            >
              Category:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="category"
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-200 text-sm font-bold mb-2"
              htmlFor="stockQuantity"
            >
              Stock Quantity:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="stockQuantity"
              type="number"
              placeholder="0"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {editingItemId ? "Update Item" : "Submit"}
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={resetForm}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Inventory;
