const fs = require('fs');
const { Pool } = require('pg');
const NotFoundError = require('../exceptions/NotFoundError');

class StorageService {
  constructor(folder) {
    this._folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    this._pool = new Pool();
  }

  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  async addAlbumCover(coverUrl, albumId) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE album_id = $2 RETURNING album_id;',
      values: [coverUrl, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui sampul. Id tidak ditemukan');
    }

    return result.rows;
  }
}

module.exports = StorageService;
