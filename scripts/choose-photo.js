const downloadImage = require('./download-image');

function isBigPhotoFlg(url) {
  let tokens = url.split('/');
  tokens = tokens[tokens.length - 1].split('-');
  return tokens.length > 0 && tokens[0] === 'photo';
}

async function choosePhotoAndDownload(imageUrls) {
  for (let i = 0; i < imageUrls.length; i++) {
    if (isBigPhotoFlg(imageUrls[i])) {
      await downloadImage(imageUrls[i], 'image.png');
      return;
    }
  }
}

exports.choosePhotoAndDownload = choosePhotoAndDownload;
