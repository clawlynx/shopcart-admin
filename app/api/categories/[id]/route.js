import { mongooseConnect } from "../../../../lib/mongoose";
import { NextResponse } from "next/server";
import { Category } from "../../../../models/Category";

export async function DELETE(request) {
  const url = await request.url;
  const id = url.slice(url.lastIndexOf("/") + 1);
  await mongooseConnect();
  await Category.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted successfully" });
}
