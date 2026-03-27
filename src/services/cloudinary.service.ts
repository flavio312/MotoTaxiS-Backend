import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { 
  CloudinaryUploadResult, 
  CloudinaryUploadOptions, 
  CloudinaryDeleteResult 
} from '../types';

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export class CloudinaryService {
  constructor() {
    console.log('✓ Cloudinary configurado correctamente');
  }

  async uploadImage(
    fileBuffer: Buffer, 
    fileName: string, 
    options: CloudinaryUploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      console.log(`📤 Subiendo imagen a Cloudinary: ${fileName}`);
      
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: options.folder || 'foto-usuarios',
            public_id: options.public_id || `users_${Date.now()}_${fileName.split('.')[0]}`,
            resource_type: 'image',
            transformation: options.transformation || [
              { width: 800, height: 600, crop: 'fill' },
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ],
            overwrite: true,
            invalidate: true,
            tags: options.tags || ['users', 'profile']
          },
          (error, result) => {
            if (error) {
              console.error('❌ Error subiendo a Cloudinary:', error);
              reject(error);
            } else if (result) {
              console.log('✓ Imagen subida exitosamente a Cloudinary');
              console.log('URL:', result.secure_url);
              resolve({
                publicId: result.public_id,
                url: result.secure_url,
                width: result.width,
                height: result.height,
                format: result.format,
                bytes: result.bytes,
                fileName: fileName
              });
            } else {
              reject(new Error('No se recibió respuesta de Cloudinary'));
            }
          }
        ).end(fileBuffer);
      });
      
    } catch (error) {
      console.error('❌ Error en uploadImage:', error);
      throw error;
    }
  }

  async deleteImage(publicId: string): Promise<CloudinaryDeleteResult> {
    try {
      console.log(`🗑️ Eliminando imagen: ${publicId}`);
      
      const result = await cloudinary.uploader.destroy(publicId);
      
      if (result.result === 'ok') {
        console.log('✓ Imagen eliminada exitosamente');
        return { success: true, result: result.result };
      } else {
        console.log('⚠️ No se pudo eliminar la imagen:', result.result);
        return { success: false, result: result.result };
      }

    } catch (error) {
      console.error('❌ Error eliminando imagen:', error);
      throw error;
    }
  }

  generateUrl(publicId: string, transformations: any[] = []): string {
    try {
      return cloudinary.url(publicId, {
        transformation: transformations,
        secure: true
      });
    } catch (error) {
      console.error('❌ Error generando URL:', error);
      throw error;
    }
  }

  async getImageDetails(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.api.resource(publicId);
      return {
        publicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        createdAt: result.created_at
      };
    } catch (error) {
      console.error('❌ Error obteniendo detalles:', error);
      throw error;
    }
  }
}

const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB máximo
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

export const cloudinaryService = new CloudinaryService();

export { cloudinary };