import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for video link "parsing" simulation
  app.post("/api/parse-link", (req, res) => {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Simulate link parsing logic
    // In a real app, this might scrape metadata or use an API
    const isQuark = url.includes("quark.cn");
    
    setTimeout(() => {
      res.json({
        success: true,
        metadata: {
          title: isQuark ? "夸克云盘视频资源" : "外部视频内容",
          thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
          duration: "02:15:40",
          size: "1.4 GB",
          type: isQuark ? "夸克云" : "直接链接",
          // For demo, we just reflect the URL back or provide a placeholder video
          videoUrl: url.includes("mp4") ? url : "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        }
      });
    }, 1500);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
