export const compressImage = (file, quality = 0.7, maxWidth = 300, maxHeight = 300, maxSizeKB = 100) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    if (width > height) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    } else {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                const compress = (currentQuality) => {
                    canvas.toBlob(
                        (blob) => {
                            if (blob.size / 1024 > maxSizeKB && currentQuality > 0.1) {
                                compress(currentQuality - 0.1);
                            } else {
                                resolve(new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() }));
                            }
                        },
                        "image/jpeg",
                        currentQuality
                    );
                };

                compress(quality);
            };

            img.onerror = (error) => reject(error);
        };
    });
};