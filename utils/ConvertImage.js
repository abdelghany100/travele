function renameImageWithAlt(image, alt) {
    if (!image.includes('.')) {
        throw new Error("Invalid image format. The image should have an extension.");
    }
    const extension = image.split('.').pop();
    return `${alt}.${extension}`;
}

// تصدير الدالة باستخدام module.exports
module.exports = renameImageWithAlt;