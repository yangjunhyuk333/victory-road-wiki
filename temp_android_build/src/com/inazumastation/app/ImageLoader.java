package com.inazumastation.app;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Handler;
import android.os.Looper;
import android.util.LruCache;
import android.widget.ImageView;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ImageLoader {
    private static ImageLoader instance;
    private final LruCache<String, Bitmap> memoryCache;
    private final ExecutorService executor = Executors.newFixedThreadPool(4);
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    private ImageLoader() {
        int maxMemory = (int) (Runtime.getRuntime().maxMemory() / 1024);
        int cacheSize = maxMemory / 8;
        memoryCache = new LruCache<String, Bitmap>(cacheSize) {
            @Override
            protected int sizeOf(String key, Bitmap bitmap) {
                return bitmap.getByteCount() / 1024;
            }
        };
    }

    public static synchronized ImageLoader getInstance() {
        if (instance == null) instance = new ImageLoader();
        return instance;
    }

    public void displayImage(final String urlString, final ImageView imageView) {
        if (urlString == null || urlString.trim().isEmpty()) {
            imageView.setImageDrawable(null);
            return;
        }

        Bitmap cached = memoryCache.get(urlString);
        if (cached != null) {
            imageView.setImageBitmap(cached);
            return;
        }

        imageView.setImageDrawable(null);
        imageView.setTag(urlString);

        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    URL url = new URL(urlString);
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setDoInput(true);
                    conn.setConnectTimeout(4000);
                    conn.setReadTimeout(4000);
                    conn.connect();
                    InputStream input = conn.getInputStream();
                    final Bitmap bitmap = BitmapFactory.decodeStream(input);
                    if (bitmap != null) {
                        memoryCache.put(urlString, bitmap);
                        mainHandler.post(new Runnable() {
                            @Override
                            public void run() {
                                if (urlString.equals(imageView.getTag())) {
                                    imageView.setImageBitmap(bitmap);
                                }
                            }
                        });
                    }
                } catch (Exception e) {}
            }
        });
    }
}