import { mongooseConnect } from "../../../lib/mongoose";
import { NextResponse } from "next/server";
import { Category } from "../../../models/Category";
import { getServerSession } from "next-auth";
import options from "../auth/[...nextauth]/options";

export async function POST(request) {
  const { categoryName, parentCategory, property, ownerEmail } =
    await request.json();
  await mongooseConnect();
  console.log(`parentCategory: ${parentCategory}`);
  if (parentCategory === "") {
    const categoryData = new Category({
      categoryName,
      property,
      ownerEmail,
    });
    await categoryData.save();
    return NextResponse.json(categoryData);
  } else {
    const categoryData = new Category({
      categoryName,
      parentCategory,
      property,
      ownerEmail,
    });
    await categoryData.save();
    return NextResponse.json(categoryData);
  }
}

export async function GET() {
  const session = await getServerSession(options);
  const existingOwner = session?.user?.email;

  await mongooseConnect();
  const categoryData = await Category.find({
    ownerEmail: existingOwner,
  }).populate("parentCategory");
  return NextResponse.json({ categoryData });
}

export async function PUT(request) {
  const { categoryName, parentCategory, property, _id, ownerEmail } =
    await request.json();

  await mongooseConnect();
  const updatedData = await Category.findByIdAndUpdate(_id, {
    categoryName,
    parentCategory,
    property,
    ownerEmail,
  });
  return NextResponse.json(updatedData);
}
