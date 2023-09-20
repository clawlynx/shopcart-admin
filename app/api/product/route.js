import { getServerSession } from "next-auth";
import { mongooseConnect } from "../../../lib/mongoose";
import { Product } from "../../../models/Product";
import { NextResponse } from "next/server";
import options from "../auth/[...nextauth]/options";

export async function POST(request) {
  const { title, description, price, images, category, property, ownerEmail } =
    await request.json();
  await mongooseConnect();
  if (category === "") {
    const ProductData = new Product({
      title,
      description,
      price,
      images: images,
      ownerEmail,
    });
    await ProductData.save();
    return NextResponse.json(ProductData);
  } else {
    const ProductData = new Product({
      title,
      description,
      price,
      images: images,
      category,
      property,
      ownerEmail,
    });
    await ProductData.save();
    return NextResponse.json(ProductData);
  }
}

export async function GET() {
  const session = await getServerSession(options);
  const existingOwner = session?.user?.email;
  await mongooseConnect();
  const productData = await Product.find({ ownerEmail: existingOwner });
  return NextResponse.json({ productData });
}
