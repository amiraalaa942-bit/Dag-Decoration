import express from "express";
import path from "path";
import sharp from "sharp";
import { authenticateJWT } from "../middleware/authentication.js";
import { PaintingModel } from '../models/Painting.js';
import fileUpload from 'express-fileupload';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();


router.get('/paintingsInfo', async (req, res) => {
  try {
    const paintingsInfo = await PaintingModel.findAll();
    res.status(200).send(paintingsInfo);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

router.get('/paintingImage/:id', async (req, res) => {
  try {
    const {id} = req.params;
    let {Height,Width} = req.query;
    let resizedWidth = Width? parseInt(Width as string) : null;
    let resizedHeight = Height? parseInt(Height as string) : null;
    let Id = parseInt(id);
    const paintingImage = await PaintingModel.getImageUrl(Id);
    
    if (!paintingImage) {
      return res.status(404).send('Image not found');
    }

    const imagePath = paintingImage.picurl;
    if (!imagePath) {
      return res.status(404).json({ error: 'Image path not found' });
    }
    
    const cleanImagePath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    const fullPath = path.join(process.cwd(), cleanImagePath);

    if(resizedHeight || resizedWidth) {
      const resizedImageBuffer = await sharp(fullPath)
        .resize(resizedWidth, resizedHeight, {
          fit: sharp.fit.inside,
          withoutEnlargement: true
        })
        .jpeg({ 
          quality: 80,
          mozjpeg: true 
        })
        .toBuffer();
      
      res.set({
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000'
      });
      res.send(resizedImageBuffer);
    } else {
      res.set({
        'Cache-Control': 'public, max-age=31536000'
      });
      return res.sendFile(fullPath);
    }
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

router.post('/paintings', authenticateJWT, async (req, res) => {
  try {
    if (!req.files?.image) {
      return res.status(400).json({ error: 'No image selected' });
    }

    const image = req.files.image as fileUpload.UploadedFile;
    const { Height, Width, Price, name } = req.body;
    const price = parseInt(Price);
    const height = parseFloat(Height);
    const width = parseFloat(Width);
    if (!name || !Price || !Height || !Width) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const fileName = image.name;
    const uniqueName = `${Date.now()}-${fileName}`;
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    await image.mv(`./uploads/${uniqueName}`);

    const imageUrl  = `/uploads/${uniqueName}`;
    const result = await PaintingModel.create(name, price, height, width, imageUrl);

    res.status(201).json({
      message: 'Upload successful',
      id: result.picId,
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.delete('/paintings',authenticateJWT,async (req,res)=>
{
  try{
    const {picId}= req.body;
    let paintingInfo = PaintingModel.deletePainting(picId);
    res.status(200).send(paintingInfo)
  }
  catch(error)
  {
    res.status(500).json({ error: 'Failed to delete paintings' });

  }

})
export default router;