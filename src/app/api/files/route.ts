import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    // Upload file to Pinata using V3 API syntax
    const upload = await pinata.upload.public.file(file);
    
    // Create the IPFS URL directly using the gateway
    const url = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${upload.cid}`;
    
    return NextResponse.json(url, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
