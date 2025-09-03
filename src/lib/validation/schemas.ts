import { z } from "zod";

export const walletAddress = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address format");

export const purchaseInput = z.object({
  amount: z.number().int().min(1).max(10000).optional(),
  packageId: z.number().int().min(0).optional(),
  chainId: z.number().int().positive(),
  transactionHash: z.string().optional(),
}).refine(
  data => data.amount || data.packageId !== undefined, 
  { message: "Provide amount or packageId" }
);

export const comicUpload = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  author: z.string().min(1).max(100),
  genre: z.string().transform(s => {
    // Convert comma-separated string to JSON string for MySQL
    const genres = s.split(",").map(x => x.trim()).filter(Boolean);
    return JSON.stringify(genres);
  }),
  freeChapters: z.coerce.number().int().min(0).max(10).default(3),
});

export const chapterUnlock = z.object({
  chapterId: z.string().cuid(),
});

export const readingProgress = z.object({
  chapterId: z.string().cuid(),
  pageNumber: z.number().int().positive(),
});

export const userUpdate = z.object({
  username: z.string().min(3).max(30).optional(),
  email: z.string().email().optional(),
});

export const nonceRequest = z.object({
  address: walletAddress,
});

export const siweVerify = z.object({
  message: z.string(),
  signature: z.string(),
});