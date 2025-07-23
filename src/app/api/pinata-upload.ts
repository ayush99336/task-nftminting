import { NextRequest, NextResponse } from 'next/server';
import {PinataSDK} from 'pinata';
import { config } from 'process';

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`
})




export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    const result = await pinata.pinFileToIPFS(buffer, {
      pinataMetadata: { name: file.name },
    });
    return NextResponse.json({ ipfsUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}` });
  } catch (error) {
    return NextResponse.json({ error: 'Pinata upload failed' }, { status: 500 });
  }
}
