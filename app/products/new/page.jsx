"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { UploadButton } from "@uploadthing/react";
import "@uploadthing/react/styles.css";
import { ReactSortable } from "react-sortablejs";
import { useSession } from "next-auth/react";

export default function New() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [propertytoFill, setPropertytoFill] = useState([]);
  const [productProperty, setProductProperty] = useState({});
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(productProperty);
    const data = {
      title,
      description,
      price,
      images: images,
      category,
      property: productProperty,
      ownerEmail: session?.user?.email,
    };
    try {
      const res = await fetch("http://localhost:3000/api/product", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        console.log("ok");
        setTitle("");
        setDescription("");
        setPrice("");
        setImages([]);
        setCategory("");
        setProductProperty({});
        router.push("/products");
      } else {
        throw new Error("failed to update");
      }
    } catch (error) {
      console.log(error);
    }
  };

  function arrangePhoto(image) {
    setImages(image);
  }

  async function fetchData() {
    const response = await fetch("http://localhost:3000/api/categories");
    if (!response.ok) {
      throw new Error("no response");
    }
    const data = await response.json();
    setCategoryList(data.categoryData);
  }

  function fetchPropertytoFill() {
    let currentP = categoryList.find((p) => p._id === category);
    console.log(currentP);
    if (currentP) {
      const props = currentP.property;
      while (currentP?.parentCategory?._id !== undefined) {
        const parent = categoryList.find(
          (p) => p._id === currentP.parentCategory._id
        );
        props.push(...parent.property);
        currentP = parent;
      }
      setPropertytoFill(props);
    } else {
      setPropertytoFill([]);
    }
  }

  function handleProductProperty(propertyName, propertyValue) {
    setProductProperty((prev) => {
      return {
        ...prev,
        [propertyName]: propertyValue,
      };
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchPropertytoFill();
  }, [category]);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>New Product</h1>
        <label>Product Name</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Product Name"
          required
        />
        <label>Category</label>
        <select
          className=""
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Uncategorized</option>
          {categoryList.length > 0 &&
            categoryList.map((c) => {
              return (
                <option value={c._id} key={c._id}>
                  {c.categoryName}
                </option>
              );
            })}
        </select>
        {propertytoFill.length > 0 &&
          propertytoFill.map((p) => (
            <div className="" key={p._id}>
              <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
              <select
                value={productProperty[p.name]}
                onChange={(e) => handleProductProperty(p.name, e.target.value)}
              >
                <option value={{}}>--Select {p.name}--</option>
                {p.values.map((v, index) => (
                  <option key={index} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          ))}
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <label>Photos</label>

        <div className="mb-2 sm:flex gap-1">
          <label className="text-sm gap-1 inline-flex justify-center items-center cursor-pointer">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                // Do something with the response
                setImages((prevState) => [...prevState, ...res]);
                console.log("Files: ", res);
              }}
              onUploadError={(error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
            />
          </label>
          <ReactSortable
            list={images}
            className="sm:flex gap-1"
            setList={arrangePhoto}
          >
            {images?.length > 0 ? (
              images.map((image) => (
                <div
                  key={image.fileKey}
                  className=" rounded-lg overflow-hidden bg-white p-4 border border-gray-200 shadow-md flex justify-center"
                >
                  <img src={image.fileUrl} className="h-24 w-24" alt="image" />
                </div>
              ))
            ) : (
              <div>No photos to show</div>
            )}
          </ReactSortable>
        </div>
        <label>Price (in INR)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="price"
          required
        />
        <button type="submit" className=" btn-primary">
          Save
        </button>
      </form>
    </>
  );
}
