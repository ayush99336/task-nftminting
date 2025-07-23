import { NextRequest, NextResponse } from 'next/server';
import { PinataSDK } from 'pinata';

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL!
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('Uploading file to Pinata:', file.name, file.type, file.size);

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload file to Pinata using pinFileToIPFS
    const result = await pinata.pinFileToIPFS(buffer, {
      pinataMetadata: {
        name: file.name
      }
    });

    const ipfsUrl = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${result.IpfsHash}`;
    console.log('File uploaded successfully:', ipfsUrl);

    return NextResponse.json({ 
      ipfsUrl,
      ipfsHash: result.IpfsHash 
    });

  } catch (error) {
    console.error('Pinata upload error:', error);
    return NextResponse.json({ 
      error: 'Pinata upload failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
