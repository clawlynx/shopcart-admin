"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function DeletePage() {
  const [productInfo, setProductInfo] = useState({});
  const params = useParams();
  const id = params.productId;
  const router = useRouter();

  async function fetchData() {
    const response = await fetch(
      `https://shopcart-admin.vercel.app/api/product/${id}`
    );
    if (!response.ok) {
      throw new Error("no response");
    }
    const data = await response.json();
    setProductInfo(data);
  }
  useEffect(() => {
    fetchData();
  }, [id]);

  function goBack() {
    router.push("/products");
  }
  async function deleteItem() {
    const response = await fetch(
      `https://shopcart-admin.vercel.app/api/product/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("no response");
    }
    const data = await response.json();
    console.log(data);
    router.push("/products");
  }

  return (
    <>
      <h1 className=" text-center">
        Do you Want to delete the Product {productInfo.title}?
      </h1>
      <div className="flex gap-2 justify-center">
        <button onClick={deleteItem} className="btn-red">
          YES
        </button>
        <button onClick={goBack} className="btn-default">
          No
        </button>
      </div>
    </>
  );
}
