"use client";
import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import { signIn, useSession } from "next-auth/react";

export default function Categories() {
  const [categoryName, setCategoryName] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [property, setProperty] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editedCategory, setEditedCategory] = useState(null);
  const [toDelete, setToDelete] = useState(false);
  const [deletedCategory, setDeletedCategory] = useState(null);
  const { data: session } = useSession();

  async function fetchData() {
    setIsLoading(true);
    const response = await fetch(
      "https://shopcart-admin.vercel.app/api/categories"
    );
    if (!response.ok) {
      throw new Error("no response");
    }
    const data = await response.json();
    setCategoryList(data.categoryData);
    setIsLoading(false);
  }

  function editCategory(item) {
    setEditedCategory(item);
    setCategoryName(item.categoryName);
    setParentCategory(item.parentCategory?._id);
    setProperty(
      item.property?.map((p) => ({
        name: p.name,
        values: p.values.toString(),
      }))
    );
  }

  function deleteCategory(item) {
    setToDelete(true);
    setDeletedCategory(item);
  }

  function cancelDelete() {
    setToDelete(false);
    setDeletedCategory(null);
  }
  async function confirmDelete(deletedCategory) {
    const response = await fetch(
      `https://shopcart-admin.vercel.app/api/categories/${deletedCategory._id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("no response");
    }
    const data = await response.json();
    console.log(data);
    setToDelete(false);
    setDeletedCategory(null);
    fetchData();
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleProperty() {
    setProperty((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  function handlePropertyNameChange(index, prp, namechange) {
    setProperty((prev) => {
      const properties = [...prev];
      properties[index].name = namechange;
      return properties;
    });
  }

  function handlePropertyValueChange(index, prp, valueChange) {
    setProperty((prev) => {
      const properties = [...prev];
      properties[index].values = valueChange;
      return properties;
    });
  }

  function removeProperty(indextoRemove) {
    setProperty((prev) => {
      const properties = [...prev];
      return properties.filter((p, pIndex) => {
        return pIndex !== indextoRemove;
      });
    });
  }

  async function saveCategory(e) {
    e.preventDefault();
    const formatedProperty = property.map((p) => ({
      name: p.name,
      values: p.values.split(","),
    }));
    if (editedCategory) {
      try {
        const data = {
          categoryName,
          parentCategory,
          property: formatedProperty,
          _id: editedCategory._id,
          ownerEmail: session?.user?.email,
        };

        const res = await fetch(
          "https://shopcart-admin.vercel.app/api/categories",
          {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        if (res.ok) {
          console.log("ok");
          setCategoryName("");
          setParentCategory("");
          setEditedCategory(null);
          setProperty([]);
          fetchData();
        } else {
          throw new Error("failed to update");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const data = {
          categoryName,
          parentCategory,
          property: formatedProperty,
          ownerEmail: session?.user?.email,
        };
        const res = await fetch(
          "https://shopcart-admin.vercel.app/api/categories",
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        if (res.ok) {
          console.log("ok");
          setCategoryName("");
          setParentCategory("");
          setProperty([]);
          fetchData();
        } else {
          throw new Error("failed to update");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  if (!session) {
    return (
      <main className=" bg-white h-screen flex items-center">
        <div className=" text-center w-full">
          <button
            onClick={() => signIn()}
            className="bg-blue-900 text-white p-2 px-4 rounded-lg"
          >
            Login with Google
          </button>
          <div>
            <h1>
              Make sure you have admin privileges before signing in. Only Admins
              can login. For admin privileges contact shafishahuldq@gmail.com
            </h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      {toDelete && deletedCategory && (
        <Modal
          itemToDelete={deletedCategory}
          cancelDelete={cancelDelete}
          confirmDelete={confirmDelete}
          state1={deletedCategory}
        />
      )}
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit Category ${editedCategory.categoryName}`
          : `Create New Category`}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category"
          ></input>
          <select
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
          >
            <option value="">No Parent</option>
            {categoryList.length > 0 &&
              categoryList.map((item) => {
                return (
                  <option key={item._id} value={item._id}>
                    {item.categoryName}
                  </option>
                );
              })}
          </select>
        </div>
        <div className=" mb-2">
          <label className="block">Properties</label>
          <button
            type="button"
            onClick={handleProperty}
            className="btn-default mb-2"
          >
            Add New
          </button>
          {property.length > 0 &&
            property.map((prp, index) => {
              return (
                <div key={index} className="mb-2 flex gap-1">
                  <input
                    type="text"
                    className="mb-0"
                    value={prp.name}
                    onChange={(e) =>
                      handlePropertyNameChange(index, prp, e.target.value)
                    }
                    placeholder="name of the property"
                  ></input>
                  <input
                    type="text"
                    className="mb-0"
                    value={prp.values}
                    onChange={(e) =>
                      handlePropertyValueChange(index, prp, e.target.value)
                    }
                    placeholder="values , comma seperated"
                  ></input>
                  <button
                    type="button"
                    onClick={() => removeProperty(index)}
                    className="btn-default"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
        </div>
        <div className=" flex gap-1">
          {editedCategory && (
            <button
              type="button"
              className="btn-default"
              onClick={() => {
                setEditedCategory(null);
                setParentCategory("");
                setCategoryName("");
                setProperty([]);
              }}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && isLoading && <div className="mt-3">Loading...</div>}
      {!editedCategory && !isLoading && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category Name</td>
              <td>Parent Category</td>
              <td></td>
            </tr>
          </thead>

          <tbody>
            {categoryList.length > 0 &&
              categoryList.map((item) => {
                return (
                  <tr key={item._id}>
                    <td>{item.categoryName}</td>
                    <td>{item.parentCategory?.categoryName}</td>
                    <td>
                      <button
                        className="btn-default"
                        onClick={() => editCategory(item)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        className="btn-red"
                        onClick={() => deleteCategory(item)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </>
  );
}
