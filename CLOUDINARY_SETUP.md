# Cloudinary Image Upload Setup Guide

This project uses **Cloudinary** for free image hosting and uploads. Images are uploaded securely through the backend API, which handles the Cloudinary integration. Cloudinary offers a generous free tier:
- **25 GB storage**
- **25 GB bandwidth/month**
- Image transformations
- CDN delivery
- No credit card required for free tier

## Setup Steps

### 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up with your email (no credit card required)
3. Verify your email address

### 2. Get Your Cloudinary Credentials

1. After logging in, go to your **Dashboard**
2. You'll see your credentials:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (click "Show" to reveal)

### 3. Add Environment Variables to Backend

1. In your `hotel_management_backend_api` folder, open or create a `.env` file
2. Add the following variables:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

Replace:
- `your_cloud_name_here` with your Cloud Name
- `your_api_key_here` with your API Key
- `your_api_secret_here` with your API Secret

**Important**: Never commit your `.env` file to version control! Keep your API Secret secure.

### 4. Restart Your Backend Server

After adding the environment variables, restart your backend server:

```bash
cd hotel_management_backend_api
npm run dev
```

## How It Works

1. **Frontend**: User selects images when creating a room
2. **Frontend**: Images are sent as files to the backend API via `multipart/form-data`
3. **Backend**: Receives files using Multer middleware
4. **Backend**: Uploads images to Cloudinary using secure server-side credentials
5. **Backend**: Stores the Cloudinary URLs in the database
6. **Backend**: Returns the created room with image URLs

This approach is more secure because:
- Cloudinary API credentials are kept on the server (not exposed to clients)
- You can validate and process images on the server
- Better security and control over uploads

## Usage

Once configured, you can:
- Upload multiple images when creating a room
- See image previews before uploading
- Remove images before submitting
- Images are automatically uploaded to Cloudinary via the backend API and URLs are stored in the database

## Alternative Free Services

If you prefer other free options, here are alternatives:

### 1. **ImgBB** (Simplest)
- Completely free, no signup required for basic use
- Simple API, but requires backend proxy for security
- **Setup**: Visit [imgbb.com](https://imgbb.com)

### 2. **ImageKit** (Good for Next.js)
- Free tier: 20 GB storage
- Built-in Next.js integration
- **Setup**: Visit [imagekit.io](https://imagekit.io)

### 3. **Uploadcare** (Developer-friendly)
- Free tier: 100 GB bandwidth/month
- Good API and SDK
- **Setup**: Visit [uploadcare.com](https://uploadcare.com)

### 4. **Supabase Storage** (If using Supabase)
- Free tier: 1 GB storage
- Good if already using Supabase for database
- **Setup**: Visit [supabase.com](https://supabase.com)

### 5. **Firebase Storage** (Google)
- Free tier: 5 GB storage, 1 GB/day downloads
- Good if already using Firebase
- **Setup**: Visit [firebase.google.com](https://firebase.google.com)

## Troubleshooting

### "Cloudinary credentials not configured" error
- Make sure `.env` file exists in `hotel_management_backend_api` folder
- Check that all three Cloudinary variables are set:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- Restart your backend server after adding variables
- Check backend console logs for detailed error messages

### Images not uploading
- Verify your Cloud Name, API Key, and API Secret are correct
- Check backend server logs for Cloudinary upload errors
- Ensure backend server is running and accessible
- Check browser console and network tab for API errors

### Upload fails
- Check your internet connection
- Verify file size (Cloudinary free tier allows up to 10 MB per file)
- Make sure you're uploading valid image files (JPG, PNG, GIF, WebP)
- Check that backend Multer middleware is properly configured
- Verify CORS settings allow file uploads from your frontend URL

