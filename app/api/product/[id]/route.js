import { mongooseConnect } from "../../../../lib/mongoose";
import { Product } from "../../../../models/Product";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = await request.url;
  const id = url.slice(url.lastIndexOf("/") + 1);
  await mongooseConnect();
  const data = await Product.findById(id).populate("category");

  return NextResponse.json(data);
}
export async function PUT(request) {
  const { title, description, price, images, category, property, ownerEmail } =
    await request.json();
  const url = await request.url;
  const id = url.slice(url.lastIndexOf("/") + 1);
  await mongooseConnect();
  const updatedData = await Product.findByIdAndUpdate(id, {
    title,
    description,
    price,
    images: images,
    category,
    property,
    ownerEmail,
  });
  return NextResponse.json(updatedData);
}

export async function DELETE(request) {
  const url = await request.url;
  const id = url.slice(url.lastIndexOf("/") + 1);
  await mongooseConnect();
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted successfully" });
}
